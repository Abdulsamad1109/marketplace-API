import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany, JoinColumn } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import { Image } from 'src/image/entities/image.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string; 

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  @JoinColumn()
  category: Category;

  @OneToMany(() => Image, (image) => image.product, {cascade: true, })
  images: Image[];

  @ManyToOne(() => Seller, (seller) => seller.products)
  @JoinColumn()
  seller: Seller;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product, {cascade: true, })
  cartItems: CartItem[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
