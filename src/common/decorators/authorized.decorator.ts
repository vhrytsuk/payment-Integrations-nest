import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import type { User } from 'src/generated/prisma/client';

export const Authorized = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request: Request = ctx.switchToHttp().getRequest();

		const user = request.user;

		return data ? (user as User)[data] : user;
	}
);
