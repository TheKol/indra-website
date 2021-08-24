import { google } from 'googleapis';

export const oauthClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `http://ec2-54-169-163-161.ap-southeast-1.compute.amazonaws.com/auth/google/callback`
);
