import User from '../models/User';
import * as Yup from 'yup';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const isEmailValid = await User.findOne({
      where: { email: req.body.email }
    });

    if (isEmailValid) {
      return res.status(401).json({ error: 'E-mail already in use' });
    }

    const user = await User.create(req.body);

    return res.json(user);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      old_password: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('old_password', (old_password, field) => {
          return old_password ? field.required() : field;
        }),
      confirm_password: Yup.string()
        .min(6)
        .when('password', (password, field) => {
          return password
            ? field.required().oneOf([Yup.ref('password')])
            : field;
        })
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

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
