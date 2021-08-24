import { v4 as uuid } from 'uuid';
import sendEmail from '../util/sendEmail';
import { getDbConnection } from '../db';

export const forgotPasswordRoute = {
  path: '/api/forgot-password/:email',
  method: 'put',
  handler: async (req, res) => {
    const { email } = req.params;

    const db = getDbConnection('react-auth-db');
    const user = await db.collection('users').findOne({ email });
    if (!user) return res.sendStatus(401);

    const passwordResetCode = uuid();

    const { result } = await db
      .collection('users')
      .updateOne({ email }, { $set: { passwordResetCode } });

    if (result.nModified > 0) {
      try {
        await sendEmail({
          recipientEmail: email,
          subject: 'Password Reset',
          text: `
            To reset your password, click this link:
            http://localhost:8080/reset-password/${passwordResetCode}
          `,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
    res.sendStatus(200);
  },
};
