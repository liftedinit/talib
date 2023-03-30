import { Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { EntityManager } from "typeorm";

export interface Entity {
  name: string;
  export(row: any): Record<string, any>;
}

export class DataExporter {
  private readonly logger = new Logger(DataExporter.name);

  constructor(
    private readonly entityManager: EntityManager,
    private readonly entities: Entity[],
  ) {}

  run(): Observable<string> {
    const entityManager = this.entityManager;
    const entities = this.entities;
    const logger = this.logger;

    return new Observable<string>(function (subscriber) {
      let ended = false;
      logger.debug("starting...");

      (async () => {
        subscriber.next("{\n");

        let first = true;
        for (const entityClass of entities) {
          if (!first) {
            subscriber.next(",\n");
          }
          const tableName = entityClass.name;
          const stream$ = await entityManager
            .createQueryBuilder()
            .select()
            .from(tableName, "")
            .stream();
          subscriber.next(`  ${JSON.stringify(tableName)}: [\n`);

          if (ended) {
            logger.warn("Runner aborted...");
            return;
          }

          {
            let f = true;
            for await (const row of stream$) {
              if (!f) {
                subscriber.next(",\n");
              }
              subscriber.next("    ");
              const entity = entityClass.export(row);
              subscriber.next(JSON.stringify(entity));
              f = false;
            }
          }

          subscriber.next(`\n  ]`);
          first = false;
        }

        subscriber.next("\n}");
        logger.debug("done!");
        subscriber.complete();
      })();

      return () => {
        ended = true;
      };
    });
  }
}
