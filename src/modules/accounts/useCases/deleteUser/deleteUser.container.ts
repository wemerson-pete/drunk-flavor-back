import { resolveUsersRepository } from '@modules/accounts/container';
import { DeleteUserService } from './DeleteUser.service';

const usersRepository = resolveUsersRepository();

const deleteUserService = new DeleteUserService(usersRepository);
export const resolveDeleteUserService = () => deleteUserService;
