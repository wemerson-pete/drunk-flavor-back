const DRINK_ERRORS = {
	not_exist: 'Drink does not exist',
	already_exist: 'Drink already exists',
	not_found: 'Drink not found',
	required_id: 'id is required',
	invalid_id_format: 'id invalid',
	required_name: 'name is required',
	invalid_name_format: 'name must have a minimum of 1 character',
	required_method: 'method is required',
	invalid_method_format: 'method must have a minimum of 1 character',
	required_cover: 'coverFile name is required',
	invalid_cover_format: 'coverFile name must have a minimum of 1 character',
	required_thumbnail: 'thumbnailFile name is required',
	invalid_thumbnail_format: 'thumbnailFile name must have a minimum of 1 character',
	required_ingredient_id: 'ingredientId is required',
	invalid_ingredient_id_format: 'ingredientId invalid',
	required_quantity: 'quantity is required',
	invalid_quantity_format: 'quantity must be greater than 0',
	required_ingredients: 'Drink must have at least 1 ingredient'
};

export { DRINK_ERRORS };
