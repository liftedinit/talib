import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, QueryFailedError } from "typeorm";
import { GeoSchedulerConfigService } from "../../../config/geo-scheduler/configuration.service";
import { Location } from "../../../database/entities/location.entity";
import { PrometheusQuery } from "../../../database/entities/prometheus-query.entity";
import { PrometheusQueryDetailsService } from "../../../metrics/prometheus-query-details/query-details.service";
import { PrometheusQueries } from "../geo-scheduler.service";

const INTERVALMS = 30000;
const MAXDATAPOINTS = 30;

interface LocationQueryNames {
  latitude: string;
  longitude: string;
}

interface LocationData {
  latitudeValues: any;
  longitudeValues: any;
}

@Injectable()
export class GeoUpdater {
  private logger: Logger;
  private queries: PrometheusQueries;

  constructor(
    private schedulerConfig: GeoSchedulerConfigService,
    private prometheusQueryDetails: PrometheusQueryDetailsService,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  with(queries: PrometheusQueries) {
    this.queries = queries;
    this.logger = new Logger(`${GeoUpdater.name}`);
    return this;
  }

  // Insert a new metric value into the metrics table
  private async updateLocationNewValues(instance, latitude, longitude) {
    // Construct the metric
    const entity = new Location();

    // entity.timestamp = new Date(latestLocation[0]);
    entity.latitude = latitude;
    entity.longitude  = longitude;
    entity.instance = instance;

    const result = await this.locationRepository.save(entity);

    return result;
  }

  private async getLocations(queryNames: LocationQueryNames, timestamp: number): Promise<LocationData> {

    // Retrieve the metric value from Grafana
    // Fetch the PromQL from the PrometheusQuery table to find the metric
    const latitudeValues =
      await this.prometheusQueryDetails.getPrometheusQueryCurrentFrames(
        queryNames.latitude,
        timestamp,
        INTERVALMS,
        MAXDATAPOINTS,
      );

    const longitudeValues =
      await this.prometheusQueryDetails.getPrometheusQueryCurrentFrames(
        queryNames.longitude,
        timestamp,
        INTERVALMS,
        MAXDATAPOINTS,
      );

    return {
      latitudeValues, 
      longitudeValues
    };
    
    }

  // Seed metric values for a prometheusQuery
  // This is the main job of the metrics scheduler
  private async seedLocationValues(queries: PrometheusQueries){

    const timestamp = new Date().getTime();

    // Get names of each prometheus Query and store in local var mapped to LocationQueryNames interface
    const locationQueryNames: LocationQueryNames = {
      latitude: queries.latitude.name,
      longitude: queries.longitude.name
    };

    const locationData = await this.getLocations(locationQueryNames, timestamp);

    // this.logger.debug(`Location Data: ${JSON.stringify(locationData)}`)

    // Create a dictionary to store the combined latitude and longitude objects
    const combinedLocations: { [key: string]: { latitude?: number; longitude?: number } } = {};

    // Iterate over the latitude values
    for (const latValue of locationData.latitudeValues) {
      // Extract the instance name
      const instanceName = latValue[2];

      // Check if the instance name already exists in the dictionary
      if (instanceName in combinedLocations) {
        // If it exists, append the latitude value to the existing instance
        combinedLocations[instanceName].latitude = latValue[1];
      } else {
        // If it doesn't exist, create a new instance with the latitude value
        combinedLocations[instanceName] = { latitude: latValue[1] };
      }
    }

    // Iterate over the longitude values
    for (const lonValue of locationData.longitudeValues) {
      // Extract the instance name
      const instanceName = lonValue[2];

      // Check if the instance name already exists in the dictionary
      if (instanceName in combinedLocations) {
        // If it exists, append the longitude value to the existing instance
        combinedLocations[instanceName].longitude = lonValue[1];
      } else {
        // If it doesn't exist, create a new entry with the longitude value
        combinedLocations[instanceName] = { longitude: lonValue[1] };
      }
    }

    this.logger.debug(`Combined geolocations: ${JSON.stringify(combinedLocations)}`);


    // Iterate over the combined locations and insert into the database
    for (const instanceName in combinedLocations) {

      // Check if the database has an entry for the instance name
      const instanceExists = await this.locationRepository.findOne({
        where: { instance: instanceName },
      });

      // if the instance doesn't exist, create a new entry
      if (!instanceExists) {
        // Check if the instance has both a latitude and longitude value
        if (
          combinedLocations[instanceName].latitude !== undefined &&
          combinedLocations[instanceName].longitude !== undefined
        ) {
          // If it does, insert the location into the database
          await this.updateLocationNewValues(
            instanceName,
            combinedLocations[instanceName].latitude,
            combinedLocations[instanceName].longitude,
          );
        }
      } else {
        // if the instance already exists check that the latitude and longitude values
        // are not null or aren't the same 
        if (
          (instanceExists.latitude !== combinedLocations[instanceName].latitude ||
            instanceExists.longitude !== combinedLocations[instanceName].longitude) &&
          combinedLocations[instanceName].latitude !== undefined &&
          combinedLocations[instanceName].longitude !== undefined
        ) {
          // If they are different, update the location in the database
          await this.updateLocationNewValues(
            instanceName,
            combinedLocations[instanceName].latitude,
            combinedLocations[instanceName].longitude,
          );
        }
      }

    }

    return null;
  }

  async run() {
    const queries = this.queries;
    try {
      this.logger.debug(`Seeding geolcations...`);
      await this.seedLocationValues(queries);
    } catch (e) {
      this.logger.log(`Error happened while updating geolocation:\n${e.stack}`);
    }
  }
}
