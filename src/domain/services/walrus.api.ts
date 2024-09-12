import { getMimeTypeFromBlob } from "@/lib/readMagicNumber";
import axios from "axios";
import toast from "react-hot-toast";

export class WalrusApi {
  constructor() {}

  async uploadFile(
    file: File,
    epochs: number,
  ): Promise<{
    blobId: string;
    size: number;
    blob: Blob | null;
    endEpoch: number;
    cost: number;
    createdAt: number;
  }> {
    console.log("uploadFile", import.meta.env.VITE_PUBLISHER, file, epochs);
    const url = `${import.meta.env.VITE_PUBLISHER}/v1/store?epochs=${epochs}`;

    const response = await axios.put(url, file);

    console.log("response", response);

    if (response.data.alreadyCertified) {
      toast.error("File already stored");
      throw new Error("File already stored");
    }

    if (response.data.newlyCreated) {
      return {
        blob: null,
        blobId: response.data.newlyCreated.blobObject.blobId,
        size: response.data.newlyCreated.blobObject.size,
        cost: response.data.newlyCreated.cost,
        createdAt: new Date().getTime(),
        endEpoch: response.data.newlyCreated.blobObject.storage.endEpoch,
      };
    }

    throw new Error("File not stored");
  }

  async getFile(fileObjectId: string): Promise<Blob> {
    const url = `${import.meta.env.VITE_AGGREGATOR}/v1/${fileObjectId}`;
    const response = await axios.get(url, { responseType: "blob" });

    const tmpBlob = new Blob([response.data]);
    const mimeType = await getMimeTypeFromBlob(tmpBlob);
    console.log("mimeType", mimeType);

    const blob = new Blob([response.data], { type: mimeType });

    return blob;
  }
}
