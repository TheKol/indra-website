import { getDbConnection } from '../db';
import jwt from 'jsonwebtoken';

export const testGetUserData = {
  path: '/api/user',
  method: 'post',
  handler: async (req, res) => {
    // const { email } = req.body;
    // console.log(email);
    // const db = getDbConnection('react-auth-db');
    // const user = await db.collection('users').findOne({ email });
    // const { userName, userPicture } = user;
    // const response = { name: userName, picture: userPicture };
    // res.json(response);

    const { token } = req.body;
    const emailUser = jwt.verify(
      token,
      process.env.JWT_SECRET,
      async (err, decoded) => {
        if (err)
          return res.status(401).json({ message: 'Unable to verify token' });

        const { email } = decoded;

        return email;
      }
    );
    console.log(emailUser);
    const db = getDbConnection('react-auth-db');
    const user = await db.collection('users').findOne({ emailUser });
    const { userName, userPicture } = user.value;
    const response = { name: userName, picture: userPicture };
    res.json(response);
  },
};
