import { Role } from 'src/auth/roles/roles.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sellers')
export class Seller {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  businessName: string;

  @Column({ length: 255 })
  ownerName: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 11 })
  phoneNumber: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column( {type: "enum", enum: Role, array: true, default: [Role.SELLER]} )
  roles: Role[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
