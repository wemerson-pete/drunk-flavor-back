import { IUpdateDrinkThumbnail } from '@modules/drinks/dtos/drink.dtos';
import { DRINK_ERRORS } from '@modules/drinks/errors/drink.errors';
import { IDrinksRepository } from '@modules/drinks/repositories/IDrinks.repository';
import { IStorageProvider } from '@shared/container/providers/storage/IStorage.provider';
import AppError from '@shared/errors/AppError';
class UpdateDrinkThumbnailService {
	constructor(private drinksRepository: IDrinksRepository, private storageProvider: IStorageProvider) {}

	async execute({ drink_id, thumbnail_file }: IUpdateDrinkThumbnail): Promise<void> {
		const drink = await this.drinksRepository.findById(drink_id);
		if (!drink) {
			throw new AppError(DRINK_ERRORS.not_exist);
		}

		if (drink.thumbnail) {
			await this.storageProvider.deleteFile(drink.thumbnail);
		}
		drink.thumbnail = thumbnail_file;

		await this.drinksRepository.update({ id: drink_id, thumbnail: drink.thumbnail });
	}
}

export { UpdateDrinkThumbnailService };
