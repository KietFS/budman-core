import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '@/entities/category.entity';
import { User } from '@/entities/user.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(
    user: User,
    name: string,
    description?: string,
  ): Promise<Category> {
    const category = this.categoryRepo.create({
      name,
      description,
      user,
    });
    return this.categoryRepo.save(category);
  }

  async findAll(user: User): Promise<Category[]> {
    return this.categoryRepo.find({
      where: { user: { id: user.id } },
      relations: ['transactions'],
    });
  }

  async findOne(id: string, user: User): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id, user: { id: user.id } },
      relations: ['transactions'],
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    user: User,
    updateData: Partial<Category>,
  ): Promise<Category> {
    const category = await this.findOne(id, user);
    Object.assign(category, updateData);
    return this.categoryRepo.save(category);
  }

  async remove(id: string, user: User): Promise<void> {
    const category = await this.findOne(id, user);
    await this.categoryRepo.remove(category);
  }
}
