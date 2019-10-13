import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
const routes = Router();

routes.post('/user', UserController.store);
routes.post('/login', SessionController.store);
routes.use(authMiddleware);
routes.put('/user', UserController.update);

export default routes;
