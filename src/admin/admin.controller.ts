import { Controller, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';

@ApiTags('Admins')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'List of admins returned successfully' })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an admin by ID' })
  @ApiParam({ name: 'id', example: 'd27c73d2-0c9c-4b3a-95c5-9a3a3a8f4b17', description: 'Admin UUID' })
  @ApiResponse({ status: 200, description: 'Admin found successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an admin by ID' })
  @ApiParam({ name: 'id', example: 'd27c73d2-0c9c-4b3a-95c5-9a3a3a8f4b17', description: 'Admin UUID' })
  @ApiBody({ type: UpdateAdminDto, examples: {
    example1: {
      summary: 'Update admin email',
      value: { email: 'newadmin@example.com' }
    },
    example2: {
      summary: 'Update full admin profile',
      value: { name: 'Jane Doe', email: 'jane.doe@example.com', phone: '+2348098765432' }
    }
  }})
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an admin by ID' })
  @ApiParam({ name: 'id', example: 'd27c73d2-0c9c-4b3a-95c5-9a3a3a8f4b17', description: 'Admin UUID' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
