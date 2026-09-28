import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
	@IsString()
	public name: string;
	@IsEmail()
	@IsNotEmpty()
	public email: string;

	@IsString()
	@MinLength(6)
	@IsNotEmpty()
	public password: string;
}
