import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Role } from 'src/auth/roles/roles.enum';
import { Seller } from 'src/seller/entities/seller.entity';
import { Buyer } from 'src/buyer/entities/buyer.entity';
import { Admin } from 'src/admin/entities/admin.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Seller, (seller) => seller.user, {onDelete: 'CASCADE'})
  seller: Seller;

  @OneToOne(() => Buyer, (buyer) => buyer.user, {onDelete: 'CASCADE'})
  buyer: Buyer;

  @OneToOne(() => Admin, (admin) => admin.user, {onDelete: 'CASCADE'})
  admin: Admin;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({select: false}) // Exclude password from select queries
  password: string;

  @Column( {type: "enum", enum: Role, array: true,} )
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date; 
}
