import { Injectable, NotFoundException, ConflictException, BadRequestException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Check if category name already exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    // If parentId is provided, check if parent exists
    if (createCategoryDto.parentId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: createCategoryDto.parentId },
      });

      if (!parentCategory) {
        throw new BadRequestException('Parent category not found');
      }
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }
  
  async findAll(queryDto: QueryCategoryDto) {
    const { search, isActive, page = 1, limit = 10 } = queryDto;
    
    const queryOptions: FindManyOptions<Category> = {
      relations: ['products'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    };

    const where: any = {};

    if (search) {
      where.name = Like(`%${search}%`); // Using Like for partial matching
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    queryOptions.where = where;

    const [categories, total] = await this.categoryRepository.findAndCount(queryOptions);

    return {
      data: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit), // Calculate total pages
      },
    };
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Category not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    // Check if new name conflicts with existing category
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    // If parentId is being updated, validate it
    if (updateCategoryDto.parentId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: updateCategoryDto.parentId },
      });

      if (!parentCategory) {
        throw new BadRequestException('Parent category not found');
      }

      // Prevent circular reference
      if (updateCategoryDto.parentId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }
    }

    Object.assign(category, updateCategoryDto); // object.assign returns the updated value immediatly
    return await this.categoryRepository.save(category); // we save the returned updated value from object.assign
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);

    // Check if category has products
    if (category.products && category.products.length > 0) {
      throw new BadRequestException('Cannot delete category that has products associated with it');
    }

    // Check if category has child categories
    const childCategories = await this.categoryRepository.find({
      where: { parentId: id },
    });

    if (childCategories.length > 0) {
      throw new BadRequestException('Cannot delete category that has subcategories');
    }

    await this.categoryRepository.remove(category);
  }

 
} 