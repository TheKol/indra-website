import sendEmail from '../util/sendEmail';

export const testEmailRoute = {
  path: '/api/test-email',
  method: 'post',
  handler: async (req, res) => {
    try {
      await sendEmail({
        recipientEmail: 'kartinakhumaeroh@gmail.com',
        name: 'tina',
      });
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  },
};
