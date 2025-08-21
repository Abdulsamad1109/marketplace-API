import { Controller, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { BuyerService } from './buyer.service';
import { UpdateBuyerDto } from './dto/update-buyer.dto';

@ApiTags('Buyers')
@Controller('buyers')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @Get()
  @ApiOperation({ summary: 'Get all buyers' })
  @ApiResponse({ status: 200, description: 'List of buyers returned successfully' })
  findAll() {
    return this.buyerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a buyer by ID' })
  @ApiParam({ name: 'id', example: 'c56a4180-65aa-42ec-a945-5fd21dec0538', description: 'Buyer UUID' })
  @ApiResponse({ status: 200, description: 'Buyer found successfully' })
  @ApiResponse({ status: 404, description: 'Buyer not found' })
  findOne(@Param('id') id: string) {
    return this.buyerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a buyer by ID' })
  @ApiParam({ name: 'id', example: 'c56a4180-65aa-42ec-a945-5fd21dec0538', description: 'Buyer UUID' })
  @ApiBody({ type: UpdateBuyerDto, examples: {
    example1: {
      summary: 'Update buyer email',
      value: { phoneNumber: 'newbuyer@example.com' }
    }
  }})
  @ApiResponse({ status: 200, description: 'Buyer updated successfully' })
  @ApiResponse({ status: 404, description: 'Buyer not found' })
  update(@Param('id') id: string, @Body() updateBuyerDto: UpdateBuyerDto) {
    return this.buyerService.update(id, updateBuyerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a buyer by ID' })
  @ApiParam({ name: 'id', example: 'c56a4180-65aa-42ec-a945-5fd21dec0538', description: 'Buyer UUID' })
  @ApiResponse({ status: 200, description: 'Buyer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Buyer not found' })
  remove(@Param('id') id: string) {
    return this.buyerService.remove(id);
  }
}
