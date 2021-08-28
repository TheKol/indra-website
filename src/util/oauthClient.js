import { google } from 'googleapis';

const pathConfig = process.env.PATH_CONFIG;

export const oauthClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `https://${pathConfig}/auth/google/callback`
);
