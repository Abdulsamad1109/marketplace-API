import { Buyer } from 'src/buyer/entities/buyer.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, CreateDateColumn, JoinColumn } from 'typeorm';

@Entity('addresses')
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 20 })
    houseNumber: string;

    @Column({ type: 'varchar', length: 100 })
    street: string;

    @Column({ type: 'varchar', length: 50 })
    city: string;

    @Column({ type: 'varchar', length: 50 })
    state: string;

    @Column({ type: 'varchar', length: 50 })
    country: string;

    @ManyToOne(() => Seller, (seller) => seller.addresses, {onDelete: 'CASCADE'})
    @JoinColumn()
    seller: Seller;

    @ManyToOne(() => Buyer, (buyer) =>  buyer.addresses, {onDelete: 'CASCADE'})
    @JoinColumn()
    buyer: Buyer;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}

