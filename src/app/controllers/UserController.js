import User from '../models/User';

class UserController {
  async store(req, res) {
    const user = await User.create(req.body);

    return res.json(user);
  }

  async update(req, res) {
    const { email, password, confirm_password } = req.body;
    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const emailIsInUse = await User.findOne({ where: { email } });

      if (emailIsInUse) {
        return res.status(401).json({ error: 'Email already in use' });
      }
    }

    if (password && password !== confirm_password) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { name } = await user.update(req.body);

    return res.json({ name, email });
  }
}

export default new UserController();
