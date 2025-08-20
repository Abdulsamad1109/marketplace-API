import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CreateAddressDto } from "src/address/dto/create-address.dto";
import { CreateUserDto } from "src/user/dto/create-user.dto";

export class CreateBuyerDto {
    @ApiProperty({ type: CreateUserDto, description: 'User details for the buyer' })
    @ValidateNested()
    @Type(() => CreateUserDto)
    user: CreateUserDto;
    
    @ApiProperty({type: CreateAddressDto, description: 'Address of the buyer'})
    @ValidateNested()
    @Type(() => CreateAddressDto)
    @IsNotEmpty()
    addresses: CreateAddressDto[];
}