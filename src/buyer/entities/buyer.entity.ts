import { Address } from "src/address/entities/address.entity";
import { Cart } from "src/cart/entities/cart.entity";
import { Order } from "src/order/entities/order.entity";
import { Transaction } from "src/payment/entities/transaction.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('buyers')
export class Buyer {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.buyer, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: User;

    @Column({ type: 'varchar', length: 11 })
    phoneNumber: string;
    
    @OneToMany(() => Address, (address) => address.buyer, {cascade: true})
    addresses: Address[];

    @OneToMany(() => Cart, (cart) => cart.buyer, {cascade: true})
    carts: Cart[];

    @OneToMany(() => Transaction, (transaction) => transaction.buyer, {cascade: true})
    transactions: Transaction[];

    @OneToMany(() => Order, (order) => order.buyer, {cascade: true})
    orders: Order[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
