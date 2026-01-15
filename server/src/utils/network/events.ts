import { Message, NetworkModule } from "@liftedinit/many-js";
import { parseBuffer, parseDateTime } from "../cbor-parsers";
import { getAnalyzerClass } from "../protocol/attributes";

export interface EventLog {
  id: ArrayBuffer | Buffer;
  time: Date;
  type: any;
  info: any;
}

export interface Events extends NetworkModule {
  list(
    max?: number,
    order?: "ASC" | "DESC" | "",
    filters?: any,
  ): Promise<{ total: number; events: EventLog[] }>;
}

export const Events: Events = {
  _namespace_: "events",

  async list(
    max?: number,
    order?: "ASC" | "DESC" | "",
    filters?: any,
  ): Promise<{ total: number; events: EventLog[] }> {
    const param = new Map([
      ...(max !== undefined ? [[0, max]] : []),
      ...(order == "ASC" ? [[1, 1]] : order == "DESC" ? [[1, 2]] : []),
      ...(filters !== undefined ? [[2, filters]] : []),
    ] as [number, number][]);
    const msg = await this.call("events.list", param);

    return parseEventList(msg);
  },
};

function parseEventInfo(info: Map<any, any>): [any, any] {
  const eventType = info.get(0);
  const AnalyzerClass = getAnalyzerClass(null, eventType);
  if (!AnalyzerClass) {
    throw new Error(`Unknown eventType: ${JSON.stringify(eventType)}`);
  }

  const analyzer = new AnalyzerClass();
  return [eventType, analyzer.analyzeEvent(info)];
}

function parseEventLog(payload: Map<any, any>): EventLog {
  const [type, info] = parseEventInfo(payload.get(2));
  return {
    id: parseBuffer(payload.get(0)),
    time: parseDateTime(payload.get(1)),
    type,
    info,
  };
}

function parseEventList(msg: Message): { total: number; events: EventLog[] } {
  const payload = msg.getPayload();
  if (!(payload instanceof Map)) {
    throw new Error("Invalid message");
  }
  const total = payload.get(0);
  const events = payload.get(1);

  if (!Array.isArray(events)) {
    throw new Error("Events is not an array.");
  }

  return {
    total,
    events: events.map(parseEventLog),
  };
}
