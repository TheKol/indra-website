import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDbConnection } from '../db';

export const logInRoute = {
  path: '/api/login',
  method: 'post',
  handler: async (req, res) => {
    const { email, password } = req.body;

    const db = getDbConnection('react-auth-db');
    const user = await db.collection('users').findOne({ email });

    // compare password from hash to db
    if (!user) return res.sendStatus(401);

    const {
      _id: id,
      isVerified,
      passwordHash,
      salt,
      userName,
      userPicture,
    } = user;
    const pepper = process.env.PAPPER_STRING;

    // use bcrypt compare function
    const isCorrect = await bcrypt.compare(
      salt + password + pepper,
      passwordHash
    );

    // if true then
    if (isCorrect) {
      jwt.sign(
        { id, isVerified, email, userName, userPicture },
        process.env.JWT_SECRET,
        { expiresIn: '2d' },
        (err, token) => {
          if (err) {
            res.sendStatus(500);
          }

          res.status(200).json({ token });
        }
      );
    } else {
      res.sendStatus(401);
    }
  },
};
