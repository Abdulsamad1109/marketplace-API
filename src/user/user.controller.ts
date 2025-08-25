import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // User creation is handled in AuthService, 
  // so this controller is focused on user management

  // GET USER PROFILE
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile (JWT protected)' })
  @ApiResponse({ status: 200, description: 'User profile returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async userProfile(@Req() req: any){
    return this.userService.fetchProfile(req.user.id);
  }


  // GET ALL USERS
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'You do not have permission to access this resource.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN) // Only admin can access this route
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'You do not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN) // Only admin can access this route
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const id = req.user.id; // comes from JWT payload
    return this.userService.update(id, updateUserDto);
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'You do not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN) // Only admin can access this route
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}