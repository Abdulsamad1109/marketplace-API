import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './initialize-payment.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
