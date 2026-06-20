import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import AppleStrategy from 'passport-apple';
import { User } from '../models/User';

export function setupPassport(): void {
  // ── Google OAuth ──────────────────────────────────────────────────────────
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ provider: 'google', providerId: profile.id });
          if (!user) {
            user = await User.create({
              provider: 'google',
              providerId: profile.id,
              displayName: profile.displayName,
              email: profile.emails?.[0]?.value,
              isGuest: false,
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );

  // ── Apple OAuth ───────────────────────────────────────────────────────────
  passport.use(
    new AppleStrategy(
      {
        clientID: process.env.APPLE_CLIENT_ID!,
        teamID: process.env.APPLE_TEAM_ID!,
        keyID: process.env.APPLE_KEY_ID!,
        privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH!,
        callbackURL: process.env.APPLE_CALLBACK_URL!,
        passReqToCallback: false,
      },
      async (_accessToken, _refreshToken, idToken, profile, done) => {
        try {
          const sub = (idToken as unknown as { sub?: string }).sub ?? profile.id;
          let user = await User.findOne({ provider: 'apple', providerId: sub });
          if (!user) {
            user = await User.create({
              provider: 'apple',
              providerId: sub,
              displayName: profile.displayName,
              email: profile.emails?.[0]?.value,
              isGuest: false,
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );
}
