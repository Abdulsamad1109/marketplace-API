import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';

@ApiTags('Admins')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin profile (JWT protected)' })
  @ApiResponse({ status: 200, description: 'Admin profile returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('profile')
  fetchProfile(@Req() req) {
    return this.adminService.fetchProfile(req);
  }

  @Get()
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'List of admins returned successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN) 
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an admin by ID' })
  @ApiParam({ name: 'id', example: 'd27c73d2-0c9c-4b3a-95c5-9a3a3a8f4b17', description: 'Admin UUID' })
  @ApiResponse({ status: 200, description: 'Admin found successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @ApiOperation({ summary: 'Update logged-in admin profile' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully.' })
  @ApiResponse({ status: 404, description: 'Admin not found.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('me')
  async updateProfile(@Req() req, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(req.user.id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an admin by ID' })
  @ApiParam({ name: 'id', example: 'd27c73d2-0c9c-4b3a-95c5-9a3a3a8f4b17', description: 'Admin UUID' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
