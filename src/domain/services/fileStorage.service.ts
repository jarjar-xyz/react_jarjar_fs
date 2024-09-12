import toast from "react-hot-toast";
import { db, WalrusObject } from "../core/db";

export class FileStorageService {
  constructor() {}

  async addFileToDb({
    blobId,
    size,
    endEpoch,
    cost,
    createdAt,
    blob,
  }: WalrusObject) {
    const isStored = await db.walrusObjects
      .where("blobId")
      .equals(blobId)
      .first();

    if (isStored) {
      toast.error("File already in db");
      return;
    }

    const walrusDbId = await db.walrusObjects.add({
      blobId,
      size,
      endEpoch,
      cost,
      createdAt,
      blob,
    });
    return walrusDbId;
  }
}
