import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Address } from "src/address/entities/address.entity";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { JoinColumn, OneToMany, OneToOne } from "typeorm";

export class Buyer {
    @ApiProperty({ type: CreateUserDto, description: 'User details for the buyer' })
    @ValidateNested()
    @Type(() => CreateUserDto)
    user: CreateUserDto;
    
    @OneToMany(() => Address, (address) => address.seller, {onDelete: 'CASCADE'})
    @JoinColumn()
    addresses: Address[];
}
