import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { BuyerService } from './buyer.service';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';

@ApiTags('Buyers')
@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get buyer profile (JWT protected)' })
  @ApiResponse({ status: 200, description: 'Buyer profile returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  fetchProfile(@Req() req) {
    return this.buyerService.fetchProfile(req);
  }

  @ApiOperation({ summary: 'Get all buyers' })
  @ApiResponse({ status: 200, description: 'List of buyers returned successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.buyerService.findAll();
  }

  @ApiOperation({ summary: 'Get a buyer by ID' })
  @ApiParam({ name: 'id', example: 'c56a4180-65aa-42ec-a945-5fd21dec0538', description: 'Buyer UUID' })
  @ApiResponse({ status: 200, description: 'Buyer found successfully' })
  @ApiResponse({ status: 404, description: 'Buyer not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buyerService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a buyer by ID' })
  @ApiResponse({ status: 200, description: 'Buyer updated successfully' })
  @ApiResponse({ status: 404, description: 'Buyer not found' })
  @ApiParam({ name: 'id', example: 'c56a4180-65aa-42ec-a945-5fd21dec0538', description: 'Buyer UUID' })
  @ApiBody({ type: UpdateBuyerDto, examples: {
    example1: {
      summary: 'Update buyer email',
      value: { phoneNumber: 'newbuyer@example.com' }
    }
  }})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBuyerDto: UpdateBuyerDto) {
    return this.buyerService.update(id, updateBuyerDto);
  }

  @ApiOperation({ summary: 'Delete a buyer by ID' })
  @ApiParam({ name: 'id', example: 'c56a4180-65aa-42ec-a945-5fd21dec0538', description: 'Buyer UUID' })
  @ApiResponse({ status: 200, description: 'Buyer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Buyer not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN) // ONLY ADMIN CAN ACCES THIS ROUTE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buyerService.remove(id);
  }
}
