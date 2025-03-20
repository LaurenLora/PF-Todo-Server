import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JWT_ACCESS_EXPIRES_IN, JWT_ACCESS_SECRET } from 'src/common/constants';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { comparePassword } from 'src/common/utils/hash';
import { Users } from 'src/users/models/users.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) throw new HttpException('User not found', 404);

    const isValid = await comparePassword(password, user.hashedPassword);

    if (!isValid) throw new UnauthorizedException('Invalid Password');

    return { _id: user._id, email: user.email };
  }

  async login(user: Pick<Users, '_id' | 'email'>) {
    if (!user) throw new HttpException('User nout found', 404);

    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
    };

    try {
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.getOrThrow<string>(JWT_ACCESS_SECRET),
        expiresIn: this.configService.getOrThrow<string>(JWT_ACCESS_EXPIRES_IN),
      });

      return { token: accessToken };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Errrr');
    }
  }
}
