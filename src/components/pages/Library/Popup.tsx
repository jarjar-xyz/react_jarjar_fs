type FileDisplayModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  content: {
    url: string;
    fileType: string;
    fileName: string;
  } | null;
};

export const FileDisplayModal = ({
  isOpen,
  onRequestClose,
  content,
}: FileDisplayModalProps) => {
  if (!isOpen || !content) return null;

  const { url, fileType, fileName } = content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-white bg-opacity-50">
      <div className="relative w-auto max-w-3xl mx-auto my-6 z-50">
        <div className="relative flex flex-col w-full bg-gray-200 rounded-[16px] shadow-[20px_20px_60px_rgba(0,0,0,0.3),-20px_-20px_60px_rgba(255,255,255,0.3)] outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
            <h3 className="text-2xl font-semibold text-gray-700">{fileName}</h3>
            <button
              className="p-2 ml-auto bg-gray-200 text-gray-700 rounded-full shadow-[-5px_-5px_10px_#ffffff,5px_5px_10px_#bebebe] hover:shadow-[inset_-5px_-5px_10px_#ffffff,inset_5px_5px_10px_#bebebe] transition-all duration-300 outline-none focus:outline-none"
              onClick={onRequestClose}
            >
              <span className="text-2xl block pl-2 pr-2">×</span>
            </button>
          </div>
          <div className="relative p-6 flex-auto">
            {fileType === "image" && (
              <img
                src={url}
                alt={fileName}
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}
            {fileType === "video" && (
              <video
                src={url}
                controls
                className="max-w-full max-h-[70vh]"
                autoPlay
                muted
              >
                Your browser does not support the video tag.
              </video>
            )}
            {fileType === "audio" && (
              <audio src={url} controls className="w-full">
                Your browser does not support the audio tag.
              </audio>
            )}
            {!["image", "video", "audio"].includes(fileType) && (
              <p className="text-center">
                This file type cannot be displayed in the browser. Please
                download to view.
              </p>
            )}
          </div>
          <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
            <button
              className="bg-gray-200 text-gray-700 font-bold uppercase text-sm px-6 py-3 rounded-lg shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 outline-none focus:outline-none"
              type="button"
              onClick={onRequestClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
