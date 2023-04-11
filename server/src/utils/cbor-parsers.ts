import { Address } from "@liftedinit/many-js";

export function parseAddress(content: any, optional: true): Address | undefined;
export function parseAddress(content: any, optional?: false): Address;
export function parseAddress(
  content: any,
  optional = false,
): Address | undefined {
  if (content instanceof Address) {
    return content;
  } else if (typeof content == "string") {
    return Address.fromString(content);
  } else if (Buffer.isBuffer(content)) {
    return new Address(content);
  } else if (content === undefined || content === null) {
    if (optional) {
      return undefined;
    }
  }

  throw new Error(
    `Invalid content type for address: ${JSON.stringify(content)}`,
  );
}

export function parseMemo(content: any, optional: true): string[] | undefined;
export function parseMemo(content: any, optional?: false): string[];
export function parseMemo(
  content: any,
  optional = false,
): string[] | undefined {
  if (typeof content == "string") {
    return [content];
  } else if (Array.isArray(content)) {
    return content.filter((x) => typeof x == "string");
  } else if (optional) {
    return undefined;
  }

  throw new Error(`Invalid content type for memo: ${JSON.stringify(content)}`);
}

export function parseBuffer(content: any, optional: true): Buffer | undefined;
export function parseBuffer(content: any, optional?: false): Buffer;
export function parseBuffer(
  content: any,
  optional = false,
): Buffer | undefined {
  if (Buffer.isBuffer(content)) {
    return content;
  } else if (optional) {
    return undefined;
  }

  throw new Error(
    `Invalid content type for buffer: ${JSON.stringify(content)}.`,
  );
}

export function parseRoles(
  roleMap: Map<Address, string[]> | Record<string, string[]>,
): {
  [address: string]: string[];
} {
  const roles = {};

  if (roleMap instanceof Map) {
    roleMap = Object.fromEntries(roleMap);
  }

  for (const [key, value] of Object.entries(roleMap)) {
    roles[key.toString()] = value;
  }

  return roles;
}

export function parseError(maybeResult: any) {
  if (!(maybeResult instanceof Map)) {
    throw "Payload is not a map.";
  }

  const code = maybeResult.get(0);
  if (typeof code !== "number") {
    throw "Code is not a number.";
  }

  const message = maybeResult.get(1);
  if (typeof message !== "string") {
    throw "Message is not a string.";
  }

  const fields: Record<string, string> = {};
  if (maybeResult.has(2)) {
    let fs = maybeResult.get(2);
    if (fs) {
      if (!(fs instanceof Map)) {
        fs = new Map(Object.entries(fs));
      }

      for (const [k, v] of fs.entries()) {
        // Worst case we get "[object Object]" as keys, but a spec following
        // blockchain should be fine here.
        fields[k.toString()] = v.toString();
      }
    }
  }

  return { code, fields, message };
}
