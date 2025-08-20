import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Address } from "src/address/entities/address.entity";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('buyers')
export class Buyer {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.buyer, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: CreateUserDto;

    @ApiProperty({ example: "08098765432" })
    @IsString()
    @IsNotEmpty()
    @Column({ type: 'varchar', length: 11 })
    phoneNumber: string;
    
    @OneToMany(() => Address, (address) => address.buyer, {onDelete: 'CASCADE'})
    @JoinColumn()
    addresses: Address[];
}
