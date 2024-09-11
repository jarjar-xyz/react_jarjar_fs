import { Upload, X } from "lucide-react";
import { useServices } from "@/domain/core/services";
import { useObservable } from "micro-observables";
import { NeuromorphicButton } from "@/components/ui/neuromorphicButton";

const TabsSelector = () => {
  const { dropzoneService } = useServices();
  const activeTab = useObservable(dropzoneService.activeTab);
  const tabs = ["walrus", "sui"] as const;

  return (
    <div className="flex mb-6 bg-gray-200 p-2 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-6 py-3 rounded-xl transition-all duration-300 ${
            activeTab === tab
              ? "bg-white text-gray-800 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.9)]"
              : "bg-transparent text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => dropzoneService.activeTab.set(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
};

const DropzoneArea = () => {
  const { dropzoneService } = useServices();
  const activeTab = useObservable(dropzoneService.activeTab);
  return (
    <div className="flex flex-col items-center justify-center pt-5 pb-6">
      <Upload className="w-16 h-16 mb-4 text-gray-400" />
      <p className="mb-2 text-sm text-gray-500">
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-gray-400">
        Any file (MAX SIZE. {activeTab === "sui" ? "110Kb" : "10MB"})
      </p>
    </div>
  );
};

const Preview = () => {
  const { dropzoneService } = useServices();
  const preview = useObservable(dropzoneService.preview);

  if (!preview) return null;
  return (
    <div className="relative w-full h-full">
      <img
        src={preview}
        alt="Preview"
        className="w-full h-full object-contain rounded-lg "
      />
      <button
        onClick={dropzoneService.removeFile}
        className="absolute top-3 right-3 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-200 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)]"
      >
        <X className="w-4 h-4 text-white" />
      </button>
    </div>
  );
};

export const Dropzone = () => {
  const { dropzoneService, moveTxService } = useServices();
  const preview = useObservable(dropzoneService.preview);
  const isDragActive = useObservable(dropzoneService.isDragActive);

  if (!dropzoneService) return null;

  return (
    <div className="mt-8 p-8 bg-gray-100 rounded-3xl shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
      <TabsSelector />
      <div
        className={`flex items-center justify-center w-full rounded-2xl overflow-hidden bg-gray-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] ${
          isDragActive ? "bg-blue-100" : ""
        }`}
        onDragEnter={dropzoneService.handleDrag}
        onDragLeave={dropzoneService.handleDrag}
        onDragOver={dropzoneService.handleDrag}
        onDrop={dropzoneService.handleDrop}
      >
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-[70vh] border-4 border-dashed border-gray-300 cursor-pointer hover:bg-gray-300 transition-all duration-300 rounded-2xl"
        >
          {preview ? <Preview /> : <DropzoneArea />}
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={dropzoneService.handleChange}
            accept="image/*"
          />
        </label>
      </div>

      <NeuromorphicButton onClick={() => moveTxService.prepareFile()}>
        Upload
      </NeuromorphicButton>
    </div>
  );
};
