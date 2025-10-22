import { Buyer } from "src/buyer/entities/buyer.entity";
import { CartItem } from "src/cart-item/entities/cart-item.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', default: 'active' })
  status: string;

  @ManyToOne(() => Buyer, (buyer) => buyer.carts)
  @JoinColumn()
  buyer: Buyer;
  

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}