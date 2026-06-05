import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID') || 'mock-facebook-app-id',
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET') || 'mock-facebook-app-secret',
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL') || 'http://localhost:3000/api/v1/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name', 'photos'],
      scope: ['email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const email = emails && emails.length > 0 ? emails[0].value : null;
    const user = {
      facebookId: profile.id,
      email: email,
      firstName: name?.givenName || 'Facebook',
      lastName: name?.familyName || 'User',
      picture: photos && photos.length > 0 ? photos[0].value : null,
      accessToken,
    };
    done(null, user);
  }
}
