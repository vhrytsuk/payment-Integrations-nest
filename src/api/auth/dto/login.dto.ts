import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
	@IsEmail()
	@IsNotEmpty()
	public email: string;

	@IsString()
	@MinLength(6)
	@IsNotEmpty()
	public password: string;
}
