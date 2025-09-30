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

async create(sellerId: string, files: Express.Multer.File[], createProductDto: CreateProductDto, ): Promise<Product> {

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

  return this.productRepository.save(product);
}

  // ONLY A LOGGED IN SELLER CAN SEE THEIR OWN PRODUCTS
  async findAllSellerProducts(sellerId: string): Promise<Product[]> {

     // Find related seller
      const seller = await this.sellerRepository.findOne({ where: { user: { id: sellerId } } }); 
      if (!seller) throw new BadRequestException('Invalid seller');

      return await this.productRepository.find({where: { seller: { id: seller.id }, },});
    }



    // ONLY ADMIN CAN FIND ALL THEIR OWN PRODUCTS
    async findAllProducts(adminId: string): Promise<Product[]> {
 
     // verify admin
      const admin = await this.adminRepository.findOne({ where: { user: { id: adminId } } }); 
      if (!admin) throw new BadRequestException('Invalid admin');

      const allProduct = await this.productRepository.find();
      if (!allProduct || allProduct.length === 0) {
        throw new NotFoundException('No products found');
      }
      return allProduct
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

      // Merge update data
      Object.assign(product, updateProductDto);

      await this.productRepository.save(product);
      
      return 'Product updated successfully' 
    }
 


    // ONLY ADMIN CAN DELETE ANY PRODUCT
    // ONLY A LOGGED IN SELLER CAN DELETE THEIR OWN PRODUCT
    async remove(userId: string, productId: string, roles: Role): Promise<string> {
  if (roles == Role.ADMIN) {
    // Admin can delete any product
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    await this.productRepository.remove(product);
    return 'Product deleted successfully';
  }

  if (roles == Role.SELLER) {
    // Seller can only delete their own product
    const product = await this.productRepository.findOne({ 
      where: { id: productId, seller: { user: { id: userId } } },
    });
    if (!product) throw new NotFoundException('Invalid product');
    await this.productRepository.remove(product);
    return 'Product deleted successfully';
  }

  throw new ForbiddenException('You do not have permission to access this resource');
  }

}



