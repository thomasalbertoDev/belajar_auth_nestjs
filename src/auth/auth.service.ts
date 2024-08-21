import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthRequest, RefreshTokenDto } from './dto/auth.dto';
import { Auth } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
  ) {}

  public async signUp(req: AuthRequest) {
    const userExist = await this.authRepository.findOne({
      where: { username: req.username },
    });

    if (userExist) {
      throw new HttpException('Username already exist', HttpStatus.CONFLICT);
    }

    req.password = await bcrypt.hash(req.password, 12);

    const savedAuth = await this.authRepository.save(req);
    return {
      id: savedAuth.id,
      username: savedAuth.username,
    };
  }

  public async signIn(req: AuthRequest) {
    const user = await this.authRepository.findOne({
      where: {
        username: req.username,
      },
    });

    if (user && (await bcrypt.compare(req.password, user.password))) {
      const payload = {
        id: user.id,
        username: user.username,
      };

      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      user.refreshToken = refreshToken;
      await this.authRepository.save(user);

      return {
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken,
          expiresIn: this.jwtService.decode(accessToken)['exp'],
        },
      };
    } else {
      throw new HttpException(
        'Username or Password Wrong',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  public async refreshToken(req: RefreshTokenDto) {
    const { refreshToken } = req;
    try {
      const decodedToken = this.jwtService.verify(refreshToken);
      const user = await this.authRepository.findOne({
        where: { id: decodedToken.id, refreshToken },
      });

      if (!user) {
        throw new HttpException(
          'Invalid refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const payload = {
        id: user.id,
        username: user.username,
      };

      const newAccessToken = this.jwtService.sign(payload);
      const newRefreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      user.refreshToken = newRefreshToken;
      await this.authRepository.save(user);

      return {
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: this.jwtService.decode(newAccessToken)['exp'],
        },
      };
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  public async logout(userId: number) {
    const user = await this.authRepository.findOne({
      where: { id: userId },
    });

    if (user) {
      user.refreshToken = null;
      await this.authRepository.save(user);
    }

    return {
      message: 'Logout success',
    };
  }
}
