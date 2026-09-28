import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterRequest {
	@ApiProperty({
		description: 'User Name',
		example: 'John Doe'
	})
	@IsString()
	public name: string;

	@ApiProperty({
		description: 'User Email',
		example: 'john.doe@example.com'
	})
	@IsEmail()
	@IsNotEmpty()
	public email: string;

	@ApiProperty({
		description: 'User Password',
		example: 'password123'
	})
	@IsString()
	@MinLength(6)
	@IsNotEmpty()
	public password: string;
}
