import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Location } from "../../database/entities/location.entity";
import { LocationService } from "./location.service";
import { LocationController } from "./location.controller";


@Module({
  imports: [
    TypeOrmModule.forFeature([Location]),
    HttpModule,
  ],
  providers: [
    LocationService,
  ],
  controllers: [LocationController],
  exports: [LocationService],
})
export class LocationModule {}
