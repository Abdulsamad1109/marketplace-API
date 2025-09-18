import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string; // Cloudinary URL

  @Column({ nullable: true })
  publicId?: string; // Cloudinary public_id (useful for deletions/updates)

  @Column({ default: false })
  isMain: boolean; // true if this is the primary/cover image

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
