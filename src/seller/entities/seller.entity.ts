import { Address } from 'src/address/entities/address.entity';
import { Transaction } from 'src/payment/entities/transaction.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';

@Entity('sellers')
export class Seller {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.seller, {onDelete: 'CASCADE'})
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', length: 255 })
  businessName: string;

  @Column({ type: 'varchar', length: 50 })
  businessType: string;

  @Column({ type: 'varchar', length: 11 })
  phoneNumber: string;

  @OneToMany(() => Address, (address) => address.seller, {cascade: true, eager: true})
  addresses: Address[];

  @OneToMany( () => Product, (product) => product.seller, {cascade: true, })
  products: Product[]

  @OneToMany(() => Transaction, transaction => transaction.seller)
  transactions: Transaction[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
