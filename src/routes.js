import { Router } from 'express';
import User from './app/models/User';
const routes = Router();

routes.post('/', async (req, res) => {
  const user = await User.create(req.body);

  return res.json(user);
});

export default routes;
