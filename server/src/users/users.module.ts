import { Module } from "@nestjs/common";
import { AdminConfigModule } from "../config/admin/configuration.module";
import { AdminConfigService } from "../config/admin/configuration.service";
import { UsersService } from "./users.service";

@Module({
  imports: [AdminConfigModule],
  providers: [AdminConfigService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
