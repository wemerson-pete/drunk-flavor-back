import { IGetCategory } from '@modules/drinks/dtos/category.dtos';
import { ICategory } from '@modules/drinks/entities/category.entity';
import { CATEGORY_ERRORS } from '@modules/drinks/errors/category.errors';
import { ICategoriesRepository } from '@modules/drinks/repositories/categories.repository.interface';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

@injectable()
class GetCategoryService {
	constructor(
		@inject('CategoriesRepository')
		private categoriesRepository: ICategoriesRepository
	) {}

	async execute({ id }: IGetCategory): Promise<ICategory> {
		const category = await this.categoriesRepository.findById(id);
		if (!category) {
			throw new AppError(CATEGORY_ERRORS.not_found);
		}

		return category;
	}
}

export { GetCategoryService };