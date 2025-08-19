import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAddressDto {

    @ApiProperty({ example: 'No. 4B' })
    @IsString()
    houseNumber?: string;
    
    @ApiProperty({ example: '123 Main St' })
    @IsNotEmpty()
    @IsString()
    street: string;
    
    @ApiProperty({ example: 'Springfield' })
    @IsNotEmpty()
    @IsString()
    city: string;
    
    @ApiProperty({ example: 'IL' })
    @IsNotEmpty()
    @IsString()
    state: string;
    
    @ApiProperty({ example: 'NIGERIA' })
    @IsNotEmpty()
    @IsString()
    country: string;
}
