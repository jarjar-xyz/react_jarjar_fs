import { db } from "@/domain/core/db";
import { getFileType } from "@/lib/guessMimeType";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import {
  FaDownload,
  FaEye,
  FaFile,
  FaFileAudio,
  FaFileImage,
  FaFilePdf,
  FaFileVideo,
} from "react-icons/fa";
import { FileDisplayModal } from "./Popup";
export const WalrusLibrary = () => {
  const walrusFiles = useLiveQuery(() => db.walrusObjects.toArray());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);

  const handleDisplay = async (blob: Blob, blobId: string) => {
    const url = URL.createObjectURL(blob);
    const fileExtension = blob.type.split("/")[1];
    const fileType = getFileType(blob.type);

    setModalContent({ url, fileType, fileName: blobId + "." + fileExtension });
    setModalIsOpen(true);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1).toLocaleString();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / 1048576).toFixed(2) + " MB";
  };

  const handleDownload = async (blob: Blob, blobId: string) => {
    const url = URL.createObjectURL(blob);
    const fileExtension = blob.type.split("/")[1];
    const fileName = blobId + "." + fileExtension;
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  };

  const getFileIcon = (mimeType: string) => {
    const fileType = getFileType(mimeType);
    switch (fileType) {
      case "image":
        return <FaFileImage />;
      case "video":
        return <FaFileVideo />;
      case "audio":
        return <FaFileAudio />;
      case "pdf":
        return <FaFilePdf />;
      default:
        return <FaFile />;
    }
  };

  if (!walrusFiles) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <h2 className="text-2xl font-bold mb-2 sm:mb-0">
            Walrus File Library
          </h2>
          <span className="text-sm text-gray-500">
            Files owned by your account
          </span>
        </div>
        <ul className="space-y-4">
          {walrusFiles.map((file) => (
            <li
              key={file.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-100 p-4 rounded-lg"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 sm:mb-0">
                <div className="flex items-center mb-2 sm:mb-0">
                  {getFileIcon(file.blob?.type ?? "")}
                  <span className="ml-4 break-all">
                    {file.blobId + "." + file.blob?.type?.split("/")[1]}
                  </span>
                </div>
                <span className="text-sm text-gray-500 sm:ml-4">
                  Created: {formatDate(file.createdAt)}
                </span>
              </div>
              <div className="flex items-center mt-2 sm:mt-0">
                <span className="mr-4">{formatFileSize(file.size)}</span>
                <button
                  onClick={() => handleDownload(file.blob!, file.blobId)}
                  className="text-black p-2 rounded-full border-black border-[1px] mr-2"
                >
                  <FaDownload />
                </button>
                <button
                  onClick={() => handleDisplay(file.blob!, file.blobId)}
                  className="bg-black text-white p-2 rounded-full "
                >
                  <FaEye />
                </button>
              </div>
            </li>
          ))}
        </ul>
        {walrusFiles?.length == 0 ? (
          <p className="text-gray-500 text-center py-8">
            You currently have no files on Walrus.
          </p>
        ) : null}
      </div>
      <FileDisplayModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        content={modalContent}
      />
    </div>
  );
};
