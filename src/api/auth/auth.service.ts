import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { Request, Response } from 'express';
import { isDevEnv, ms, StringValue } from 'src/common/utils';
import { User } from 'src/generated/prisma/client';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { LoginRequest, RegisterRequest } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
	private readonly JWT_ACCESS_TOKEN_TTL: StringValue;
	private readonly JWT_REFRESH_TOKEN_TTL: StringValue;
	private readonly COOKIES_DOMAIN: string;

	public constructor(
		private readonly prismaService: PrismaService,
		private readonly ConfigService: ConfigService,
		private readonly jwtService: JwtService
	) {
		this.JWT_ACCESS_TOKEN_TTL = this.ConfigService.getOrThrow<StringValue>(
			'JWT_ACCESS_TOKEN_TTL'
		);
		this.JWT_REFRESH_TOKEN_TTL = this.ConfigService.getOrThrow<StringValue>(
			'JWT_REFRESH_TOKEN_TTL'
		);
		this.COOKIES_DOMAIN =
			this.ConfigService.getOrThrow<string>('COOKIES_DOMAIN');
	}

	public async register(res: Response, data: RegisterRequest) {
		const { email, name, password } = data;

		const exist = await this.prismaService.user.findUnique({
			where: {
				email: email
			}
		});

		if (exist) {
			throw new ConflictException('User already exists');
		}

		const hashedPassword = await hash(password);

		const user = await this.prismaService.user.create({
			data: {
				email,
				name,
				password: hashedPassword
			}
		});

		return this.auth(res, user);
	}

	public async login(res: Response, dto: LoginRequest) {
		const { email, password } = dto;

		const user = await this.prismaService.user.findUnique({
			where: {
				email
			}
		});

		if (!user) {
			throw new NotFoundException('Wrong email or password');
		}

		const isValidPassword = await verify(user.password, password);

		if (!isValidPassword) {
			throw new NotFoundException('Wrong email or password');
		}

		return this.auth(res, user);
	}

	public logout(res: Response) {
		this.setCookie(res, '', new Date(0));
	}

	public async refresh(req: Request, res: Response) {
		if (!req?.cookies.refreshToken) {
			throw new UnauthorizedException('Refresh token is missing');
		}

		const refreshToken = req.cookies.refreshToken as string;

		const payload: JwtPayload =
			await this.jwtService.verifyAsync(refreshToken);

		if (payload) {
			const user = await this.prismaService.user.findUnique({
				where: {
					id: payload.id
				}
			});

			if (!user) {
				throw new UnauthorizedException('User not found');
			}

			return this.auth(res, user);
		}
	}

	private async auth(res: Response, user: User) {
		const { accessToken, refreshToken, refreshTokenExpires } =
			await this.generateTokens(user);

		this.setCookie(res, refreshToken, refreshTokenExpires);

		return {
			accessToken
		};
	}

	private async generateTokens(user: User) {
		const payload: JwtPayload = {
			id: user.id
		};

		const refreshTokenExpires = new Date(
			Date.now() + ms(this.JWT_REFRESH_TOKEN_TTL)
		);

		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: ms(this.JWT_ACCESS_TOKEN_TTL)
		});

		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: ms(this.JWT_REFRESH_TOKEN_TTL)
		});

		return {
			accessToken,
			refreshToken,
			refreshTokenExpires
		};
	}

	private setCookie(res: Response, value: string, expires: Date) {
		res.cookie('refreshToken', value, {
			httpOnly: true,
			secure: !isDevEnv(this.ConfigService),
			sameSite: 'lax',
			domain: this.COOKIES_DOMAIN,
			expires
		});
	}
}
