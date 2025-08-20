import { Seller } from 'src/seller/entities/seller.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

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
    seller: Seller;
}

