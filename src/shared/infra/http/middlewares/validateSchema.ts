import { z } from 'zod';
import AppError from '@shared/errors/AppError';
import { AppNextFunction, AppRequest, AppResponse } from '../types';

const validateSchema =
	<T>(schema: z.ZodTypeAny) =>
	(request: AppRequest, response: AppResponse, next: AppNextFunction) => {
		const data: T = request.body;

		const result = schema.safeParse(data);

		if (!result.success) {
			const { issues } = result.error;
			throw new AppError(issues[0].message);
		}

		request.body = result.data;

		next();
	};

export { validateSchema };
