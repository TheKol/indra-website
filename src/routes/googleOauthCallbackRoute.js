import jwt from 'jsonwebtoken';
import { getGoogleUser } from '../util/getGoogleUser';
import { updateOrCreateUserFromOauth } from '../util/updateOrCreateUserFromOauth';

export const googleOauthCallbackRoute = {
  path: '/auth/google/callback',
  method: 'get',
  handler: async (req, res) => {
    const { code } = req.query;

    const oauthUserInfo = await getGoogleUser({ code });
    const updatedUser = await updateOrCreateUserFromOauth({ oauthUserInfo });
    const { _id: id, isVerified, email, userName, userPicture } = updatedUser;

    jwt.sign(
      {
        id,
        isVerified,
        email,
        userName,
        userPicture,
      },
      process.env.JWT_SECRET,
      (err, token) => {
        if (err) return res.sendStatus(500);
        res.redirect(
          `ec2-13-212-97-81.ap-southeast-1.compute.amazonaws.com/login?token=${token}`
        );
      }
    );
  },
};
