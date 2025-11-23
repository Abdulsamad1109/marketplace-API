import { Buyer } from 'src/buyer/entities/buyer.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, JoinColumn,} from 'typeorm';


export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  ABANDONED = 'abandoned',
}

@Entity('transactions') 
export class Transaction {

@PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  reference: string;

  @Column()
  email: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @OneToOne(() => Cart, (cart) => cart.transaction, { onDelete: 'SET NULL', nullable: false })
  @JoinColumn()
  cart: Cart

  @ManyToOne(() => Buyer, (buyer) => buyer.transactions, { onDelete: 'SET NULL', nullable: false })
  @JoinColumn()
  buyer: Buyer;


  // data from Paystack
  @Column({ nullable: true })
  access_code: string;

  @Column({ nullable: true })
  authorization_url: string;

  @Column({ nullable: true })
  gateway_response: string;

  @Column({ nullable: true })
  channel: string;

  @Column({ nullable: true })
  card_type: string;

  @Column({ nullable: true })
  bank: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; 

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}