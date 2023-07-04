import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { isUserAdmin } from '@middlewares/isAdminUser';
import { CreateUserController } from '@modules/accounts/useCases/createUser/CreateUserController';
import { DeleteUserController } from '@modules/accounts/useCases/deleteUser/DeleteUserController';
import { ListUsersController } from '@modules/accounts/useCases/listUsers/ListUsersController';
import { ProfileUserController } from '@modules/accounts/useCases/profileUser/ProfileUserController';
import { UpdateUserController } from '@modules/accounts/useCases/updateUser/UpdateUserController';
import { UpdateUserRoleController } from '@modules/accounts/useCases/updateUserRole/UpdateUserRoleController';
import { Router } from 'express';

const createUserController = new CreateUserController();
const profileUserController = new ProfileUserController();
const deleteUserController = new DeleteUserController();
const updateUserController = new UpdateUserController();
const updateUserRoleController = new UpdateUserRoleController();
const listUsersController = new ListUsersController();

const usersRoutes = Router();

usersRoutes.post('/', ensureAuthenticated, isUserAdmin, createUserController.handle);
usersRoutes.get('/', ensureAuthenticated, isUserAdmin, listUsersController.handle);
usersRoutes.get('/profile', ensureAuthenticated, profileUserController.handle);
usersRoutes.delete('/', ensureAuthenticated, isUserAdmin, deleteUserController.handle);
usersRoutes.patch('/', ensureAuthenticated, updateUserController.handle);
usersRoutes.patch('/role', ensureAuthenticated, isUserAdmin, updateUserRoleController.handle);

export default usersRoutes;
