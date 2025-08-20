import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Role } from 'src/auth/roles/roles.enum';
import { Seller } from 'src/seller/entities/seller.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Seller, (seller) => seller.user, {onDelete: 'CASCADE'})
  seller: Seller;

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
