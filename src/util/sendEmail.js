import AWS from 'aws-sdk';

const SES_CONFIG = {
  accessKeyId: process.env.AWS_SES_ACC_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACC_KEY,
  region: 'ap-southeast-1',
};

const AWS_SES = new AWS.SES(SES_CONFIG);

const sendEmail = ({ recipientEmail, subject, text }) => {
  const msg = {
    Source: 'indra@paperispaperis.com',
    Destination: {
      ToAddresses: [recipientEmail],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: text,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
  };
  return AWS_SES.sendEmail(msg).promise();
};

export default sendEmail;
