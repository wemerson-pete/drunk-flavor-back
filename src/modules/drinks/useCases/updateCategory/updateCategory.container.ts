import { resolveCategoriesRepository } from '@modules/drinks/container';
import { UpdateCategoryService } from './UpdateCategory.service';

const categoriesRepository = resolveCategoriesRepository();

const updateCategoryService = new UpdateCategoryService(categoriesRepository);
export const resolveUpdateCategoryService = () => updateCategoryService;
