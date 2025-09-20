import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { Image } from 'src/image/entities/image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { Seller } from 'src/seller/entities/seller.entity';

@Injectable ()
export class ProductService {
constructor(
  @InjectRepository(Product) private readonly productRepository: Repository<Product>,
  @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  @InjectRepository(Seller) private readonly sellerRepository: Repository<Seller>,
  @InjectRepository(Image) private readonly imageRepository: Repository<Image>, 
  private readonly cloudinaryService: CloudinaryService,
) {}

async create(sellerId: string, files: Express.Multer.File[], createProductDto: CreateProductDto, ): Promise<Product> {
  console.log('files:', files);

  const { name, description, price, stock, categoryId } = createProductDto;

  // 1. Find related category
  const category = await this.categoryRepository.findOneBy({ id: categoryId });
  if (!category) throw new BadRequestException('Invalid category');

  // 2. Find related seller
  console.log('SellerId from JWT:', sellerId);
  const seller = await this.sellerRepository.findOne({ where: { user: { id: sellerId } } }); 
  console.log('Seller from DB:', seller);

  if (!seller) throw new BadRequestException('Invalid seller');
 

  // 3. Upload images to Cloudinary
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

  // 4. Create product with images
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


  async findAll(): Promise<Product[]> {
      return await this.productRepository.find();
    }

    // async findOne(id: number): Promise<Product> {
    //   const product = await this.productRepository.findOne({ where: { id } });
    //   if (!product) {
    //     throw new NotFoundException(`Product not found`);
    //   }
    //   return product;
    // }
  
    // async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    //   const product = await this.findOne(id);
    //   Object.assign(product, updateProductDto);
    //   return await this.productRepository.save(product);
    // }

    // async remove(id: number): Promise<void> {
    //   const product = await this.findOne(id);
    //   await this.productRepository.remove(product);
    // }

}





































// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Product } from './entities/product.entity';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';

// @Injectable()
// export class ProductService {
//   constructor(
//     @InjectRepository(Product)
//     private readonly productRepository: Repository<Product>,
//   ) {}

//   async create(createProductDto: CreateProductDto): Promise<Product> {
//     const product = this.productRepository.create(createProductDto);
//     return await this.productRepository.save(product);
//   }

//   async findAll(): Promise<Product[]> {
//     return await this.productRepository.find();
//   }

//   async findOne(id: number): Promise<Product> {
//     const product = await this.productRepository.findOne({ where: { id } });
//     if (!product) {
//       throw new NotFoundException(`Product not found`);
//     }
//     return product;
//   }
 
//   async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
//     const product = await this.findOne(id);
//     Object.assign(product, updateProductDto);
//     return await this.productRepository.save(product);
//   }

//   async remove(id: number): Promise<void> {
//     const product = await this.findOne(id);
//     await this.productRepository.remove(product);
//   }
// }
