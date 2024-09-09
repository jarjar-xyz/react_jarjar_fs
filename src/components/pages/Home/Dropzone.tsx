import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { useServices } from "@/domain/core/services";
import toast from "react-hot-toast";

export const Dropzone = () => {
  const { moveTxService } = useServices();
  const [isDragActive, setIsDragActive] = useState(false);
  const [preview, setPreview] = useState<null | string>(null);

  const handleDrag = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        console.log("handleDrop", file);
        console.log("handleDrop", file);
        if (file.size > 112000) {
          toast.error("File size exceeds 112KB");
          return;
        }
        moveTxService.file.set(file);
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
      }
    },
    [moveTxService],
  );

  const handleChange = useCallback(
    (e: any) => {
      e.preventDefault();
      console.log("handleChange", e);
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        console.log("handleChange", file.size);
        if (file.size > 112000) {
          toast.error("File size exceeds 112KB");
          return;
        }
        moveTxService.file.set(file);
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
      }
    },
    [moveTxService],
  );

  const removeFile = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    moveTxService.file.set(null);
    moveTxService.fileObjectId.set(null);
    setPreview(null);
  };

  return (
    <div
      className={`flex items-center justify-center w-full rounded-xl overflow-hidden mt-8 ${
        isDragActive ? "bg-blue-100" : "bg-gray-100"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <label
        htmlFor="dropzone-file"
        className="rounded-xl flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100 h-[70vh]"
      >
        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-200"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload
              className={`w-12 h-12 mb-3 ${isDragActive ? "text-blue-400" : "text-gray-400"}`}
            />
            <p className="mb-2 text-sm text-gray-300">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-400">
              Any file (MAX SIZE. 250Kb)
            </p>
          </div>
        )}
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={handleChange}
          accept="image/*"
        />
      </label>
    </div>
  );
};
