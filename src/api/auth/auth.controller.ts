import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { AuthResponse, LoginRequest, RegisterRequest } from './dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	@ApiOperation({
		summary: 'Register a new user',
		description: 'Registers a new user and returns an access token.'
	})
	@ApiOkResponse({
		type: AuthResponse
	})
	@Post('register')
	public async register(
		@Res({ passthrough: true }) res: Response,
		@Body() data: RegisterRequest
	) {
		return await this.authService.register(res, data);
	}

	@ApiOperation({
		summary: 'Login a user',
		description: 'Logs in a user and returns an access token.'
	})
	@ApiOkResponse({
		type: AuthResponse
	})
	@Post('login')
	public async login(
		@Res({ passthrough: true }) res: Response,
		@Body() data: LoginRequest
	) {
		return await this.authService.login(res, data);
	}

	@ApiOperation({
		summary: 'Refresh access token',
		description: 'Refreshes the access token using the refresh token.'
	})
	@ApiOkResponse({
		type: AuthResponse
	})
	@Post('refresh')
	public async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		return await this.authService.refresh(req, res);
	}

	@ApiOperation({
		summary: 'Logout a user',
		description: 'Logs out a user by clearing the refresh token cookie.'
	})
	@Post('logout')
	public logout(@Res({ passthrough: true }) res: Response) {
		return this.authService.logout(res);
	}
}
