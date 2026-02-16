import { IsString, MinLength, MaxLength } from 'class-validator'

export class AcceptInviteDto {
  @IsString()
  @MinLength(6)
  password!: string

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name!: string
}