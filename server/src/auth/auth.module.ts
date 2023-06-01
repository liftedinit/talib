import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { JwtConfigModule } from "../config/jwt/configuration.module";
import { JwtConfigService } from "../config/jwt/configuration.service";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    JwtConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [JwtConfigModule],
      inject: [JwtConfigService],
      useFactory: (jwtConfigService) => ({
        global: true,
        secret: jwtConfigService.secret,
        signOptions: { expiresIn: "60s" },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtConfigService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
