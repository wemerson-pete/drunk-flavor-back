import { USER_ERRORS } from '@modules/accounts/errors/user.errors';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/inMemory/Users.repository';
import { ROLES } from '@modules/accounts/types/roles';
import { BcryptProvider } from '@shared/container/providers/encryption/implementations/Bcrypt.provider';
import AppError from '@shared/errors/AppError';
import { ObjectId } from 'bson';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateUserService } from '@modules/accounts/useCases/updateUser/UpdateUser.service';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let updateUserService: UpdateUserService;
let encryptionProvider: BcryptProvider;

// test constants
const planPassword = '123456789';
const email = 'user@test.com';
const name = 'User';
const surname = 'Test';
const role = ROLES.admin;
const updatedName = 'New';
const updatedSurname = 'User';
const updatedEmail = 'new.user@test.com';
const updatedPlanPassword = '987654321';

describe('Update User', () => {
	beforeEach(async () => {
		usersRepositoryInMemory = new UsersRepositoryInMemory();
		encryptionProvider = new BcryptProvider();
		updateUserService = new UpdateUserService(usersRepositoryInMemory, encryptionProvider);
	});

	it('Should be able to update an user', async () => {
		const createdUser = await usersRepositoryInMemory.create({
			name,
			surname,
			email,
			role,
			password: await encryptionProvider.hash(planPassword)
		});
		await updateUserService.execute({
			id: createdUser._id,
			name: updatedName,
			surname: updatedSurname,
			email: updatedEmail,
			password: updatedPlanPassword
		});

		const verifyUser = await usersRepositoryInMemory.findById(createdUser._id);

		expect(verifyUser.email).toEqual(updatedEmail);
		expect(verifyUser.name).toEqual(updatedName);
		expect(verifyUser.surname).toEqual(updatedSurname);
		expect(verifyUser).toHaveProperty('_id');
		expect(verifyUser).toHaveProperty('created_at');
	});

	it('Should not be able to update the user email to another email already in use', async () => {
		const createdUser = await usersRepositoryInMemory.create({
			name,
			surname,
			email,
			role,
			password: await encryptionProvider.hash(planPassword)
		});
		await usersRepositoryInMemory.create({
			name: updatedName,
			surname: updatedSurname,
			email: updatedEmail,
			role,
			password: await encryptionProvider.hash(updatedPlanPassword)
		});

		await expect(
			updateUserService.execute({
				id: createdUser._id,
				name: updatedName,
				surname: updatedSurname,
				email: updatedEmail,
				password: updatedPlanPassword
			})
		).rejects.toEqual(new AppError(USER_ERRORS.already_exist));
	});

	it('should not be able to update a nonexistent user', async () => {
		const nonexistentUserId = new ObjectId().toString();
		await expect(
			updateUserService.execute({
				id: nonexistentUserId,
				name: updatedName,
				surname: updatedSurname,
				email: updatedEmail,
				password: updatedPlanPassword
			})
		).rejects.toEqual(new AppError(USER_ERRORS.not_exist));
	});
});
