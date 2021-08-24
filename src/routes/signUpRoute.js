import { getDbConnection } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import sendEmail from '../util/sendEmail';

export const signUpRoute = {
  path: '/api/signup',
  method: 'post',
  handler: async (req, res) => {
    const { email, password } = req.body;

    // connect to DB
    const db = getDbConnection('react-auth-db');
    const user = await db.collection('users').findOne({ email });

    // 409 conflic error code
    if (user) return res.sendStatus(409);

    const salt = uuid();
    const pepper = process.env.PAPPER_STRING;

    // encypt database
    const passwordHash = await bcrypt.hash(salt + password + pepper, 10);

    // verification string send to user
    const verificationString = uuid();

    // additional info about user
    const startingInfo = {
      hairColor: '',
      favoriteFood: '',
      bio: '',
    };

    // create new user in database
    const result = await db.collection('users').insertOne({
      email,
      passwordHash,
      salt,
      info: startingInfo,
      isVerified: false,
      verificationString,
    });

    // get id from result
    const { insertedId } = result;

    // send verification email using sendEmail funct
    try {
      await sendEmail({
        recipientEmail: email,
        subject: `Please verify your email`,
        text: `Thanks for signing up! To verify your email, click here:
        http://localhost:8080/verify-email/${verificationString}
        `,
      });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }

    // generate JWT for all info except passwordHash
    jwt.sign(
      {
        id: insertedId,
        email,
        info: startingInfo,
        isVerified: false,
      },
      //JSON web tokken secret
      process.env.JWT_SECRET,
      {
        expiresIn: '2d',
      },
      (err, token) => {
        if (err) {
          // 500 something wrong with server
          return res.status(500).send(err);
        }
        res.status(200).json({ token });
      }
    );
  },
};
