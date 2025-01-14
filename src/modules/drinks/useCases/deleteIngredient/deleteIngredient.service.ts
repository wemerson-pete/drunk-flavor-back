import { IDeleteIngredient } from '@modules/drinks/dtos/ingredient.dtos';
import { INGREDIENT_ERRORS } from '@modules/drinks/errors/ingredient.errors';
import { IIngredientsRepository } from '@modules/drinks/repositories/IIngredients.repository';
import AppError from '@shared/errors/AppError';

class DeleteIngredientService {
	constructor(private ingredientsRepository: IIngredientsRepository) {}

	async execute({ id }: IDeleteIngredient): Promise<void> {
		const ingredientExists = await this.ingredientsRepository.findById(id);
		if (!ingredientExists) {
			throw new AppError(INGREDIENT_ERRORS.not_exist);
		}

		await this.ingredientsRepository.delete(id);
	}
}

export { DeleteIngredientService };
