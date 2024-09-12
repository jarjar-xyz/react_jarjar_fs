import { observable, WritableObservable } from "micro-observables";
import { MoveTxService } from "./move-tx.service";
import toast from "react-hot-toast";

export class DropzoneService {
  isDragActive: WritableObservable<boolean> = observable(false);
  preview: WritableObservable<{ url: string; fileType: string } | null> =
    observable(null);
  activeTab: WritableObservable<"walrus" | "sui"> = observable<
    "walrus" | "sui"
  >("walrus");
  moveTxService: MoveTxService;

  constructor(moveTxService: MoveTxService) {
    this.moveTxService = moveTxService;
    console.log("this.moveTxService constructor", this.moveTxService);
    this.handleChange = this.handleChange.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.removeFile = this.removeFile.bind(this);
  }

  setIsDragActive(isDragActive: boolean) {
    this.isDragActive.set(isDragActive);
  }

  handleDrag(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    this.setIsDragActive(e.type === "dragenter" || e.type === "dragover");
  }

  handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    this.setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    this.handleFile(file);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const file = e.target.files?.[0];
    this.handleFile(file);
  }

  handleFile(file: File | undefined) {
    if (!file) {
      toast.error("No file selected");
      return;
    }
    const maxSize = this.activeTab.get() === "sui" ? 112000 : 10485760;
    if (file.size > maxSize) {
      toast.error("File size exceeds max size");
      return;
    }
    this.moveTxService.file.set(file);
    const objectUrl = URL.createObjectURL(file);
    this.preview.set({ url: objectUrl, fileType: file.type });
  }

  removeFile(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    this.moveTxService.file.set(null);
    this.moveTxService.fileObjectId.set(null);
    this.preview.set(null);
    this.moveTxService.uploadLoading.set(false);
  }
}
