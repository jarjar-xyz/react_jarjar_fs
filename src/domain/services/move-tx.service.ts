import { WritableObservable } from "micro-observables";
import { observable } from "micro-observables";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import toast from "react-hot-toast";
import { guessMimeType } from "@/lib/guessMimeType";
import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui/utils";

console.log("SUI_CLOCK_OBJECT_ID",SUI_CLOCK_OBJECT_ID);

const PACKAGE_ID =
  "0xf9ed7e35ec12ae14becc95d58ce52b220922321e66c05a3339b567a40c3d7c73";
const MODULE_NAME = "jarjar_fs";
export class MoveTxService {
  suiClient: SuiClient | null = null;
  signAndExecute: any = null;
  uploadProgress: WritableObservable<number> = observable(0);
  userAddress: string | undefined = undefined;
  file: WritableObservable<File | null> = observable(null);
  fileObjectId: WritableObservable<string | null> = observable(null);

  constructor() {}

  async getOwnedFiles(walletAddress: string): Promise<string[]> {
    if (!this.suiClient) throw new Error("SuiClient not initialized");

    const objects = await this.suiClient.getOwnedObjects({
      owner: walletAddress,
      filter: {
        StructType: `${PACKAGE_ID}::${MODULE_NAME}::File`
      },
      options: {
        showType: true,
      },
    });

    console.log("objects", objects);

    const fileObjects = objects.data
      .filter(obj => obj.data?.type?.includes(`${PACKAGE_ID}::${MODULE_NAME}::File`))
      .map(obj => obj.data?.objectId)
      .filter((id): id is string => id !== undefined);

    console.log("fileObjects", fileObjects);
    return fileObjects;
  }

  async getOwnedFilesInfo(): Promise<any[]> {
    if (!this.suiClient) throw new Error("SuiClient not initialized");
    if (!this.userAddress) throw new Error("User address not initialized");

    const objects = await this.getOwnedFiles(this.userAddress);
    const fileInfos = await Promise.all(objects.map(obj => this.getFileInfo(obj)));
    return fileInfos;
  }

  async executeTx(tx: Transaction, wait: boolean = false) {
    const exec = new Promise(async (resolve, reject) => {

      // if (!this.suiClient || !this.userAddress) {
      //   throw new Error("SuiClient or user address not initialized");
      // }

      // const coins = await this.suiClient.getCoins({
      //   owner: this.userAddress,
      //   coinType: "0x2::sui::SUI",
      // });


    
      // // Sort coins by balance in descending order
      // const sortedCoins = coins.data.sort((a, b) => BigInt(b.balance) - BigInt(a.balance) as unknown as number);
    
      // // Select the coin with the highest balance
      // const gasCoin = sortedCoins[0];
    
      // if (!gasCoin) {
      //   throw new Error("No SUI coins found in the wallet");
      // }
      // // Set the gas coin for the transaction
      // tx.setGasPayment([{ objectId: gasCoin.coinObjectId, digest: gasCoin.digest, version: gasCoin.version }]);
      // tx.setGasBudget(1000000000);

      this.signAndExecute(
        {
          transaction: tx,
          requestType: 'WaitForLocalExecution',
          options: {
            showEffects: true,
            showObjectChanges: true,
            showInput: true
          },
        },
        {
          onSuccess: async (data: any) => {
            try {
              const result = wait ? await this.onSuccessWithWait(data) : await this.onSuccess(data);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          },
          onError: (error: any) => {
            this.onError(error);
            reject(error);
          },
        },
      );
    });

    let i = 0;
    while (true) {
      try {
        await exec;
        break;
      } catch (error) {
        if (i >= 3) {
          throw error;
        }
        i++;
        console.log("retry", i, error);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    return exec;
  }

  onSuccess = async (data: any) => {
    console.log("start onSuccess", data);
    return data;
  }

  onSuccessWithWait = async (data: any) => {
    console.log("start onSuccess", data);
    if (!this.suiClient) throw new Error("SuiClient not initialized");
    const tx = await this.suiClient.waitForTransaction({
      digest: data.digest,
      options: {
        showEffects: true,
      },
    });
    console.log("end onSuccess", tx);
    return tx;
  };

  onError = async (data: any) => {
    console.log("onError", data);
    toast.error("Error signing and executing transaction" + data.message);
    return data;
  };

  async deleteFile(fileId: string): Promise<unknown> {
    if (!this.suiClient) throw new Error("SuiClient not initialized");

    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::delete_file`,
      arguments: [tx.object(fileId)],
    });

    return await this.executeTx(tx, true);
  }

  async createFile(): Promise<unknown> {
    const file = this.file.get();
    if (!file) {
      toast.error("File not selected");
      throw new Error("File not selected");
    }

    this.uploadProgress.set(10);
    console.log("createFile", file);
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::create_file`,
      arguments: [tx.pure.u64(file.size), 
        tx.pure.string(file.name), 
        tx.object(SUI_CLOCK_OBJECT_ID)],
    });


    const result:any = await this.executeTx(tx, true);
    console.log("result", result);

    const objectId = result.effects.created[0].reference.objectId;
    console.log("objectId", objectId);
    // const effects = bcs.TransactionEffects.parse(Uint8Array.from(result.rawEffects));
    // const fileObjectId = effects.V2?.changedObjects[1][0] as string;
    // console.log("fileObjectId", fileObjectId);
    this.fileObjectId.set(objectId);
    return objectId;
  }

  async prepareFile(): Promise<void> {
    const file = this.file.get();

    if (!this.userAddress) {
      toast.error("Connect your wallet first!");
      return;
    }

    if (!file) {
      toast.error("File not selected");
      throw new Error("File not selected");
    }
    // const chunkSize = 1024 * 16 - 5; // 16KB chunks
    const chunkSize = 1024 * 16 - 5; //Error: Error checking transaction input objects: 16kb
    //Error: Error checking transaction input objects: 256kb
    // SizeLimitExceeded { limit: "maximum pure argument size", value: "16384" } (code: -32602)
    const chunksPerTx = 7; // Number of chunks to add per transaction
    const fileSize = file.size;
    const totalChunks = Math.ceil(fileSize / chunkSize);


    const newFileId = await this.createFile();
    console.log("newFileId", newFileId);
    for (let i = 0; i < totalChunks; i += chunksPerTx) {
      const tx = new Transaction();
      for (let j = 0; j < chunksPerTx && i + j < totalChunks; j++) {
        const chunkIndex = i + j;
        const start = chunkIndex * chunkSize;
        const end = Math.min(fileSize, start + chunkSize);
        const chunk = await file.slice(start, end).arrayBuffer();
        await this.addChunk(newFileId as string, chunkIndex, new Uint8Array(chunk), tx);
      }
  
      await this.executeTx(tx, true);
      this.uploadProgress.set(Math.round(((i) / totalChunks) * 80));
      toast.success("File uploaded, go to Library to see it");
    }
  }

  addChunk(
    fileId: string,
    index: number,
    data: Uint8Array,
    tx: Transaction,
  ): void {
    const serializedData = Array.from(data); // Convert Uint8Array to regular array

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::add_chunk`,
      arguments: [
        tx.object(fileId),
        tx.pure.u64(index),
        tx.pure(bcs.vector(bcs.U8).serialize(serializedData)),
      ],
    });
  }

  async getFileInfo(fileId: string): Promise<any> {
    if (!fileId || !fileId.length) throw new Error("FileId not provided");
    if (!this.suiClient) throw new Error("SuiClient not initialized");
    if (!this.userAddress) throw new Error("User address not initialized");

    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::get_file_info`,
      arguments: [tx.object(fileId)],
    });

    const result = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: this.userAddress
    });

    console.log("getFileInfo result", result);

    const file_size = result.results?.[0]?.returnValues?.[0]?.[0] || [];
    const file_name = result.results?.[0]?.returnValues?.[1]?.[0] || [];
    const file_created_at = result.results?.[0]?.returnValues?.[2]?.[0] || [];
    const parsed_file_size = bcs.u64().parse(Uint8Array.from(file_size));
    const parsed_file_name = bcs.string().parse(Uint8Array.from(file_name));
    const parsed_file_created_at = bcs.u64().parse(Uint8Array.from(file_created_at));

    return { id:fileId, file_size: parsed_file_size, file_name: parsed_file_name, created_at: parsed_file_created_at };
  }

  async retrieveFile(fileId: string): Promise<string> {
    if (!fileId || !fileId.length) throw new Error("FileId not provided");
    if (!this.suiClient) throw new Error("SuiClient not initialized");

    const { file_size, file_name } = await this.getFileInfo(fileId);
    console.log("file", file_size, file_name);
    const chunkCount = await this.getChunkCount(fileId);
    const chunks = [];
    let fileData = new Uint8Array();
    for (let i = 0; i < chunkCount; i++) {
      const chunk = await this.getChunk(fileId, i);
      chunks.push(chunk);
      if (!chunk) break;
      fileData = new Uint8Array([...fileData, ...chunk]);
    }
    const mimeType = guessMimeType(file_name);
    console.log("mimeType", mimeType);
    const blob = new Blob([fileData], { type: mimeType });
    const outputFile = new File([blob], file_name, { type: mimeType });

    return URL.createObjectURL(outputFile);
  }

  async getChunk(fileId: string, index: number): Promise<number[] | void> {
    if (!this.suiClient) throw new Error("SuiClient not initialized");
    if (!this.userAddress) throw new Error("User address not initialized");

    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::get_chunk`,
      arguments: [tx.object(fileId), tx.pure.u64(index)],
    });

    const result = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: this.userAddress
    });

    const FileChunk = bcs.struct("FileChunk", {
      index: bcs.u64(),
      data: bcs.vector(bcs.u8()),
    });

    // Parse the result to extract the chunk data
    // Note: This assumes the chunk data is returned as a vector<u8>
    const chunkResult = result.results?.[0]?.returnValues?.[0]?.[0] || [];
    const parsed = FileChunk.parse(new Uint8Array(chunkResult));
    if (!result.results?.[0]?.returnValues?.[0]) {
      throw new Error("No chunk data returned");
    }

    return parsed.data;
  }

  async getChunkCount(fileId: string): Promise<number> {
    if (!this.suiClient) throw new Error("SuiClient not initialized");
    if (!this.userAddress) throw new Error("User address not initialized");

    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::chunk_count`,
      arguments: [tx.object(fileId)],
    });

    const result = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender:this.userAddress
    });
    const chunk_count = result.results?.[0]?.returnValues?.[0]?.[0] || [];
    const parsed_chunk_count = bcs.u64().parse(Uint8Array.from(chunk_count));

    // Parse the result to extract the chunk count
    //@ts-ignore
    return parsed_chunk_count;
  }

  async getChunkOrder(fileId: string): Promise<number[]> {
    if (!this.suiClient) throw new Error("SuiClient not initialized");
    if (!this.userAddress) throw new Error("User address not initialized");
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::get_chunk_order`,
      arguments: [tx.object(fileId)],
    });
    const result = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: this.userAddress
        
    });

    console.log("getChunkOrder result", result);
    const chunk_order = result.results?.[0]?.returnValues?.[0]?.[0] || [];
    const parsed_chunk_order = bcs
      .vector(bcs.u64())
      .parse(Uint8Array.from(chunk_order));
    // Parse the result to extract the chunk order
    //@ts-ignore
    return parsed_chunk_order;
  }
}