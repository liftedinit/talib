import { EntityManager } from "typeorm";
import { Entity } from "./data-exporter";

export class DataImportRunner {
  constructor(manager: EntityManager, entities: Entity[]) {}
}
