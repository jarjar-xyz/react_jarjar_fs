// db.ts
import Dexie, { type EntityTable } from "dexie";

export interface WalrusObject {
  id?: number;
  blobId: string;
  size: number;
  blob: Blob | null;
  endEpoch: number;
  cost: number;
  createdAt: number;
}

const db = new Dexie("WalrusDatabase") as Dexie & {
  walrusObjects: EntityTable<
    WalrusObject,
    "id" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  walrusObjects: "++id, blobId, size, blob, epoch, cost, createdAt", // primary key "id" (for the runtime!)
});

export { db };
