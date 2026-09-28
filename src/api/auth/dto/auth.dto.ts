import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
	@ApiProperty({
		description: 'JWT Access Token',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
	})
	public accessToken: string;
}
