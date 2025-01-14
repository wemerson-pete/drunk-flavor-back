import { IUpdateIngredientRequest } from '@modules/drinks/dtos/ingredient.dtos';
import { INGREDIENT_ERRORS } from '@modules/drinks/errors/ingredient.errors';
import { mapToTranslationsName } from '@modules/drinks/mappers/translations.mapper';
import { ICategoriesRepository } from '@modules/drinks/repositories/ICategories.repository';
import { IIngredientsRepository } from '@modules/drinks/repositories/IIngredients.repository';
import AppError from '@shared/errors/AppError';

class UpdateIngredientService {
	constructor(
		private ingredientsRepository: IIngredientsRepository,
		private categoriesRepository: ICategoriesRepository
	) {}

	async execute({ id, translations, is_alcoholic, category_id }: IUpdateIngredientRequest): Promise<void> {
		const ingredientExists = await this.ingredientsRepository.findById(id);
		if (!ingredientExists) {
			throw new AppError(INGREDIENT_ERRORS.not_exist);
		}

		const translationsName = mapToTranslationsName(translations);
		const ingredientNameALreadyExists = await this.ingredientsRepository.findByName(translationsName);
		if (
			ingredientNameALreadyExists &&
			ingredientExists._id.toString() !== ingredientNameALreadyExists._id.toString()
		) {
			throw new AppError(INGREDIENT_ERRORS.already_exist);
		}

		const categoryExists = await this.categoriesRepository.findById(category_id);
		if (!categoryExists) {
			throw new AppError(INGREDIENT_ERRORS.invalid_category_format);
		}

		await this.ingredientsRepository.update({ id, translations, is_alcoholic, category: categoryExists });
	}
}

export { UpdateIngredientService };
