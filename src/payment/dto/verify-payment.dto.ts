import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class VerifyPaymentDto {
  @ApiProperty({ example: 'ref_123456789' })
  @IsString()
  reference: string;
}