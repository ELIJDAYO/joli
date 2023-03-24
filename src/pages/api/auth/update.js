import bcryptjs from 'bcryptjs';
import User from 'models/Users';
import { getSession } from 'next-auth/react';
import db from 'utils/db';

async function handler(req, res) {
  // Check the http req, if not put then return err
  if (req.method !== 'PUT') {
    // maybe it's forget post delete which are not supported
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }

  const { user } = session;
  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !email.includes('@') ||
    (password && password.trim().length < 5)
  ) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }
  //   if verything is okay and we are ready to update the user info.
  await db.connect();
  //    what we did is to get the user by the user ID inside the session
  const toUpdateUser = await User.findById(user._id);
  toUpdateUser.name = name;
  toUpdateUser.email = email;

  if (password) {
    toUpdateUser.password = bcryptjs.hashSync(password);
  }

  await toUpdateUser.save();
  await db.disconnect();
  res.send({
    message: 'User updated',
  });
}

export default handler;
