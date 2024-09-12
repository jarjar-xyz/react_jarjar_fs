import { db, WalrusObject } from "@/domain/core/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
export const WalrusLibrary = () => {
  const walrusFiles = useLiveQuery(() => db.walrusObjects.toArray());
  const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({});

  console.log("imageUrls", imageUrls);

  console.log("walrusFiles", walrusFiles);

  useEffect(() => {
    if (walrusFiles) {
      const urls: { [key: number]: string } = {};
      walrusFiles.forEach((file) => {
        if (file.blob instanceof Blob) {
          try {
            urls[file.id!] = URL.createObjectURL(file.blob);
          } catch (error) {
            console.error(
              `Failed to create object URL for file ${file.id}:`,
              error,
            );
          }
        }
      });
      setImageUrls(urls);
    }

    // Cleanup function to revoke object URLs
    return () => {
      Object.values(imageUrls).forEach(URL.revokeObjectURL);
    };
  }, [walrusFiles]);

  if (!walrusFiles) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {" "}
      <div>
        <h1>Walrus Library</h1>
        <ul>
          {walrusFiles.map((file: WalrusObject) => (
            <li key={file.id}>
              <div>
                Blob ID: {file.blobId}, Size: {file.size} bytes
              </div>
              <div>Created: {new Date(file.createdAt).toLocaleString()}</div>
              {file.blob && imageUrls[file.id!] && (
                <img
                  src={imageUrls[file.id!]}
                  alt={`Walrus object ${file.id}`}
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
