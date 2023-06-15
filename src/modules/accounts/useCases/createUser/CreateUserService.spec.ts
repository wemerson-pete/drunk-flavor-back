import { ICreateUser } from '@modules/accounts/dtos/Users';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/inMemory/UsersRepository';
import { BcryptProvider } from '@shared/container/providers/encryption/implementations/BcryptProvider';
import AppError from '@shared/errors/AppError';
import 'reflect-metadata';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateUserService } from './CreateUserService';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserService: CreateUserService;
let bcryptProvider: BcryptProvider;

// test constants
const planPassword = '123456789';
const email = 'user@test.com';
const name = 'User';
const surname = 'Test';
let createTestUser: ICreateUser = {
	name,
	surname,
	email,
	password: planPassword
};

describe('Create User', () => {
	beforeEach(async () => {
		usersRepositoryInMemory = new UsersRepositoryInMemory();
		bcryptProvider = new BcryptProvider();
		createUserService = new CreateUserService(usersRepositoryInMemory, bcryptProvider);
	});

	it('Should be able to create a user', async () => {
		await createUserService.execute(createTestUser);

		const verifyUser = await usersRepositoryInMemory.findByEmail(email);

		expect(verifyUser.email).toEqual(email);
		expect(verifyUser.name).toEqual(name);
		expect(verifyUser.surname).toEqual(surname);
		expect(verifyUser).toHaveProperty('id');
		expect(verifyUser).toHaveProperty('created_at');
	});

	it('Should not be able to create an user with an existing email', async () => {
		usersRepositoryInMemory.create({
			name,
			surname,
			email,
			password: await bcryptProvider.hash(planPassword)
		});

		await expect(createUserService.execute(createTestUser)).rejects.toEqual(new AppError('User already exists'));
	});
});
