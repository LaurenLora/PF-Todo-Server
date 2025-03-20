import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWT_ACCESS_EXPIRES_IN, JWT_ACCESS_SECRET } from 'src/common/constants';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local-auth.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (confService: ConfigService) => ({
        secret: confService.getOrThrow<string>(JWT_ACCESS_SECRET),
        signOptions: {
          expiresIn: confService.getOrThrow<string>(JWT_ACCESS_EXPIRES_IN),
        },
      }),
      inject: [ConfigService],
    }),
  ],

  providers: [AuthService, JwtService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
