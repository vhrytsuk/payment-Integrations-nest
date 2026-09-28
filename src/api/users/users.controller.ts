import { Controller, Get } from '@nestjs/common';
import { Authorized, Protected } from 'src/common/decorators';
import type { User } from 'src/generated/prisma/client';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	public constructor(private readonly usersService: UsersService) {}

	@Protected()
	@Get('@me')
	public getMe(@Authorized() user: User) {
		return user;
	}
}
