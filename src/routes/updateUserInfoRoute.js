import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';
import { getDbConnection } from '../db';

export const updateUserInfoRoute = {
  path: '/api/users/:userId',
  method: 'put',
  handler: async (req, res) => {
    // get the auth header from client
    const { authorization } = req.headers;
    // get user ID parameter
    const { userId } = req.params;
    // update from body
    const updates = (({ favoriteFood, hairColor, bio }) => ({
      favoriteFood,
      hairColor,
      bio,
    }))(req.body);

    // check is authorization is include?
    if (!authorization) {
      return res.status(401).json({ message: 'No authorization header sent' });
    }

    // check token
    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err)
        return res.status(401).json({ message: 'Unable to verify token' });

      const { id, isVerified } = decoded;

      // check user ID
      if (id !== userId)
        return res
          .status(403)
          .json({ message: 'Not allowed to update that users data' });

      // check user is verified before use apps?
      if (!isVerified)
        return res.status(403).json({
          message:
            'You need to verify your email before you can update your data',
        });

      // if match update the user data in database
      const db = getDbConnection('react-auth-db');
      const result = await db
        .collection('users')
        .findOneAndUpdate(
          { _id: ObjectID(id) },
          { $set: { info: updates } },
          { returnOriginal: false }
        );

      // get data and send to client
      const { email, info } = result.value;

      jwt.sign(
        { id, email, isVerified, info },
        process.env.JWT_SECRET,
        { expiresIn: '2d' },
        (err, token) => {
          if (err) {
            return res.status(200).json(err);
          }
          res.status(200).json({ token });
        }
      );
    });
  },
};
