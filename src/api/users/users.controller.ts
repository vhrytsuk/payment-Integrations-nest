import { Controller, Get } from '@nestjs/common';
import type { Request } from 'express';
import { Authorized, Protected } from 'src/common/decorators';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	public constructor(private readonly usersService: UsersService) {}

	@Protected()
	@Get('@me')
	public getMe(@Authorized('id') id: string) {
		return id;
	}
}
