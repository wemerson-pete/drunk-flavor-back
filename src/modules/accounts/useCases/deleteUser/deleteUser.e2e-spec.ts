import 'reflect-metadata';
import { ICreateUser } from '@modules/accounts/dtos/user.dtos';
import { UsersRepository } from '@modules/accounts/infra/mongo/repositories/Users.repository';
import { UsersTokensRepository } from '@modules/accounts/infra/mongo/repositories/UsersTokens.repository';
import { IUsersRepository } from '@modules/accounts/repositories/IUsers.repository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokens.repository';
import { ROLES } from '@modules/accounts/types/roles';
import { DayjsDateProvider } from '@shared/container/providers/date/implementations/DayjsDateProvider';
import { BcryptProvider } from '@shared/container/providers/encryption/implementations/Bcrypt.provider';
import { JsonwebtokenProvider } from '@shared/container/providers/jwt/implementations/Jsonwebtoken.provider';
import { app } from '@shared/infra/http/app';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AuthenticateUserService } from '../authenticateUser/AuthenticateUser.service';
import { dropCollection, emptyCollection, initiateMongo } from '@shared/infra/database/mongo';
import { UserToken } from '@modules/accounts/infra/mongo/entities/userToken.model';
import { User } from '@modules/accounts/infra/mongo/entities/user.model';
import auth from '@config/auth';
import { ObjectId } from 'bson';

let usersRepository: IUsersRepository;
let usersTokensRepository: IUsersTokensRepository;
let bcryptProvider: BcryptProvider;
let dayjsDateProvider: DayjsDateProvider;
let jsonwebtokenProvider: JsonwebtokenProvider;
let authenticateUserService: AuthenticateUserService;

// test constants
const adminUser: ICreateUser = {
	name: 'Admin',
	surname: 'Test',
	email: 'admin@test.com',
	password: 'admin123',
	role: ROLES.admin
};

const partnerUser: ICreateUser = {
	name: 'User',
	surname: 'Test',
	email: 'user@test.com',
	password: '123456789',
	role: ROLES.partner
};

describe('Create user Controller', () => {
	beforeAll(async () => {
		usersRepository = new UsersRepository();
		usersTokensRepository = new UsersTokensRepository();
		bcryptProvider = new BcryptProvider();
		dayjsDateProvider = new DayjsDateProvider();
		jsonwebtokenProvider = new JsonwebtokenProvider();
		authenticateUserService = new AuthenticateUserService(
			usersRepository,
			usersTokensRepository,
			dayjsDateProvider,
			jsonwebtokenProvider,
			bcryptProvider
		);

		await initiateMongo();
	});

	beforeEach(async () => {
		await emptyCollection(User);
		await emptyCollection(UserToken);
	});

	afterAll(async () => {
		await dropCollection(User);
		await dropCollection(UserToken);
	});

	it('Should be able to delete a user', async () => {
		await usersRepository.create({
			...adminUser,
			password: await bcryptProvider.hash(adminUser.password)
		});
		const createdPartnerUser = await usersRepository.create({
			...partnerUser,
			password: await bcryptProvider.hash(partnerUser.password)
		});
		const authenticateResponse = await authenticateUserService.execute({
			email: adminUser.email,
			password: adminUser.password
		});
		const adminToken = authenticateResponse.token.token;

		const response = await request(app)
			.delete('/users')
			.send({ id: createdPartnerUser._id })
			.set('Authorization', `Bearer ${adminToken}`);

		expect(response.status).toBe(204);
	});

	it('Should not be able to delete a nonexisting user', async () => {
		await usersRepository.create({
			...adminUser,
			password: await bcryptProvider.hash(adminUser.password)
		});

		const authenticateResponse = await authenticateUserService.execute({
			email: adminUser.email,
			password: adminUser.password
		});
		const adminToken = authenticateResponse.token.token;
		const nonexistentUserId = new ObjectId().toString();

		const response = await request(app)
			.delete('/users')
			.send({ id: nonexistentUserId })
			.set('Authorization', `Bearer ${adminToken}`);

		expect(response.status).toBe(400);
	});

	it('Should not be able to delete a user without being authenticated', async () => {
		const invalidUserToken = jsonwebtokenProvider.createToken({
			subject: '',
			secret: 'incorrect secret token',
			expires_in: auth.expires_in_token
		});

		const response = await request(app)
			.delete('/users')
			.send(partnerUser)
			.set('Authorization', `Bearer ${invalidUserToken}`);

		expect(response.status).toBe(401);
	});

	it('Should not be able to delete a user without being admin', async () => {
		const createdAdminUser = await usersRepository.create({
			...adminUser,
			password: await bcryptProvider.hash(adminUser.password)
		});
		await usersRepository.create({
			...partnerUser,
			password: await bcryptProvider.hash(partnerUser.password)
		});
		const authenticateResponse = await authenticateUserService.execute({
			email: partnerUser.email,
			password: partnerUser.password
		});
		const partnerToken = authenticateResponse.token.token;

		const response = await request(app)
			.delete('/users')
			.send({ id: createdAdminUser._id })
			.set('Authorization', `Bearer ${partnerToken}`);

		expect(response.status).toBe(403);
	});
});