import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, Matches, ValidateNested } from "class-validator";
import { CreateAddressDto } from "src/address/dto/create-address.dto";
import { CreateUserDto } from "src/user/dto/create-user.dto";

export class CreateBuyerDto {
    @ApiProperty({ type: CreateUserDto, description: 'User details for the buyer' })
    @ValidateNested()
    @Type(() => CreateUserDto)
    user: CreateUserDto;

    @ApiProperty({ example: "08098765432" })
    @Matches(/^\d{11}$/, { message: 'Phone number must be exactly 11 digits' })
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;
}