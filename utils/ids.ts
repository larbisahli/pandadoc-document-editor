import { Id } from "@/interfaces/document";

const generateRandomId = (n: number) => {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(n);
    crypto.getRandomValues(buf);
    return Array.from(buf);
  }
  // fallback
  return Array.from({ length: n }, () =>
    Math.floor(Math.random() * 0xffffffff),
  );
};

function randomBase36(length = 12): string {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  const nums = generateRandomId(length);
  let out = "";
  for (let i = 0; i < length; i++) out += alphabet[nums[i] % 36];
  return out;
}

function newIdFactory<T extends string>(prefix: string) {
  return (suffix?: string): Id<T> => {
    const sfx = (suffix ?? randomBase36()).toLowerCase();
    if (!/^[a-z0-9_-]+$/.test(sfx)) {
      throw new Error(`Invalid id suffix "${sfx}". Allowed: [a-z0-9_-]+`);
    }
    return `${prefix}_${sfx}` as Id<T>;
  };
}

export const newDocumentId = newIdFactory<"doc">("doc");
export const newPageId = newIdFactory<"page">("page");
export const newRootId = newIdFactory<"root">("root");
export const newNodeId = newIdFactory<"node">("node");
export const newInstanceId = newIdFactory<"instance">("inst");
export const newTemplateId = newIdFactory<"template">("tpl");
export const newFieldId = newIdFactory<"field">("fld");
