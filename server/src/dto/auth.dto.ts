import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class SignInDto {
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({ description: "Username." })
  username: string;

  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({ description: "Password in plaintext." })
  password: string;
}
