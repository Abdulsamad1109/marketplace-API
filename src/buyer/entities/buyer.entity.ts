import { Address } from "src/address/entities/address.entity";
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
    
    @OneToMany(() => Address, (address) => address.buyer, {onDelete: 'CASCADE'})
    @JoinColumn()
    addresses: Address[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
