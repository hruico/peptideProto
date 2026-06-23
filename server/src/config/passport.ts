import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';

export function setupPassport(): void {
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
}
