import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { Image } from 'src/image/entities/image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { Seller } from 'src/seller/entities/seller.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { Role } from 'src/auth/roles/roles.enum';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { Pagination } from './decorators/pagination-params.decorator';
import { PaginatedResponse } from './dto/paginated-response.dto';

@Injectable ()
export class ProductService {
constructor(
  @InjectRepository(Product) private readonly productRepository: Repository<Product>,
  @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  @InjectRepository(Seller) private readonly sellerRepository: Repository<Seller>,
  @InjectRepository(Image) private readonly imageRepository: Repository<Image>, 
  @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>,
  private readonly cloudinaryService: CloudinaryService,
) {}

  async create(sellerId: string, files: Express.Multer.File[], createProductDto: CreateProductDto, ): Promise<string> {

    // Validate presence of images
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required'); 
    }

    const { name, description, price, stock, categoryId } = createProductDto;

    // Find related category
    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) throw new BadRequestException('Invalid category');

    // Find related seller
    const seller = await this.sellerRepository.findOne({ where: { user: { id: sellerId } } }); 
    if (!seller) throw new BadRequestException('Invalid seller');
  

    // Upload images to Cloudinary
    const imageEntities: Image[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadResult = await this.cloudinaryService.uploadFile(file);

      const image = this.imageRepository.create({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        isMain: i === 0, // first image is main by default
      });

      imageEntities.push(image);
    }

    // Create product with images
    const product = this.productRepository.create({
      name,
      description,
      price,
      stock,
      category,
      seller,
      images: imageEntities,
    });

    await this.productRepository.save(product);

    return `Product created successfully`;
  }



  // ONLY A LOGGED IN SELLER CAN SEE THEIR OWN PRODUCTS
  async findAllSellerProducts(sellerId: string): Promise<Product[]> {

     // Find related seller
      const seller = await this.sellerRepository.findOne({ where: { user: { id: sellerId } } }); 
      if (!seller) throw new BadRequestException('Invalid seller');

      return await this.productRepository.find({where: { seller: { id: seller.id }, },});
    }



  
    async findAll(filters: ProductFiltersDto, pagination: Pagination, ): Promise<PaginatedResponse<Product>> {
    const { search, category, minPrice, maxPrice, sortBy } = filters;
    const { limit, offset } = pagination;

    // Build the query using QueryBuilder
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .addSelect('category.name') // select only id and name from category
      // .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('seller.user', 'user');

    // Filter by product name (search)
    if (search) {
      queryBuilder.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    // Filter by category name
    if (category) {
      queryBuilder.andWhere('LOWER(category.name) = LOWER(:category)', {
        category,
      });
    }

    // I CONVERTED TO LOWERCASE TO MAKE IT CASE INSENSITIVE - SQL COMPARISON [DONE ABOVE]

    // Filter by price range
    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        queryBuilder.orderBy('product.price', 'ASC');
        break;
      case 'price_desc':
        queryBuilder.orderBy('product.price', 'DESC');
        break;
      case 'name_asc':
        queryBuilder.orderBy('product.name', 'ASC');
        break;
      case 'name_desc':
        queryBuilder.orderBy('product.name', 'DESC');
        break;
      case 'newest':
        queryBuilder.orderBy('product.createdAt', 'DESC');
        break;
      default:
        queryBuilder.orderBy('product.createdAt', 'DESC');
    }

    // Apply pagination
    queryBuilder.skip(offset).take(limit);

    // Execute query
    const [products, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponse(
      products,
      total,
      pagination.page,
      pagination.size,
    );
  }



    // ONLY ADMIN CAN FIND A PRODUCT
    async findOne(adminId: string, ProductId: string): Promise<Product> {

      // verify admin
      const admin = await this.adminRepository.findOne({ where: { user: { id: adminId } } }); 
      if (!admin) throw new BadRequestException('Invalid admin');

      const product = await this.productRepository.findOne({ where: { id: ProductId } });
      if (!product) {
        throw new NotFoundException(`Product not found`);
      }

      return product;
    }
  

    // ONLY A LOGGED IN SELLER CAN UPDATE THEIR OWN PRODUCT
    async update(sellerId: string, productId: string, updateProductDto: UpdateProductDto,): Promise<string> {
      // Find related seller
      const seller = await this.sellerRepository.findOne({ where: { user: { id: sellerId } }, });
      if (!seller) throw new BadRequestException('Invalid seller');

      // Find product belonging to this seller
      const product = await this.productRepository.findOne({
        where: { id: productId, seller: { id: seller.id } },
      });
      if (!product) throw new NotFoundException('Invalid product');

      Object.assign(product, updateProductDto);

      await this.productRepository.save(product);
      
      return 'Product updated successfully' 
    }
 


    // ONLY ADMIN CAN DELETE ANY PRODUCT
    // ONLY A LOGGED IN SELLER CAN DELETE THEIR OWN PRODUCT
    async remove(userId: string, productId: string, roles: Role[]) {
    // Find product with seller relation
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['seller', 'seller.user', 'images' ],
    });

    if (!product) throw new NotFoundException('Product not found');

    const isAdmin = roles.includes(Role.ADMIN);
    const isSeller = roles.includes(Role.SELLER);

    // Check if seller owns the product
    const ownsProduct = isSeller && product.seller?.user?.id === userId;

    console.log({ userId, sellerUserId: product.seller?.user?.id, roles, isAdmin, isSeller, ownsProduct });
  console.log(product)

  if (!isAdmin && (!isSeller || !ownsProduct)) {
    throw new ForbiddenException('You are not allowed to delete this product');
  }

    // Delete product from repository
    await this.productRepository.remove(product); // cascade deletes related entities

    // Delete images in parallel from Cloudinary (safe check for public_id)
  if (product.images && product.images.length > 0) {
    await Promise.all(
      product.images
        .filter((image) => !!image.publicId) // ensure it's defined
        .map(async (image) => {
          try {
            await this.cloudinaryService.deleteImage(image.publicId as string);
          } catch (error) {
            console.error(`Failed to delete image`, error.message);
          }
        }),
    );
  }

    return 'Product deleted successfully';
  } 

}



  