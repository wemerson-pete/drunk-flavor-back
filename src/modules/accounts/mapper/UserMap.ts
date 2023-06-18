import { instanceToInstance } from 'class-transformer';
import { IUserProfileResponse } from '@modules/accounts/dtos/Users';
import { Prisma } from '@prisma/client';
import User from '@modules/accounts/entities/User';

class UserMap {
	static toDTO({ email, name, surname, id }: User): IUserProfileResponse {
		const user = instanceToInstance({
			email,
			name,
			surname,
			id
		});
		return user;
	}
}

export { UserMap };
