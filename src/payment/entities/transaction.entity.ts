import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,} from 'typeorm';


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

  @Column({ nullable: true })
  paystack_reference: string;

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
  paid_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}