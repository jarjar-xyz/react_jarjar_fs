import { useServices } from "@/domain/core/services";
import { useEffect, useState } from "react";

export const NeuromorphicInput = ({ placeholder = "", type = "text" }) => {
    const { moveTxService } = useServices();
  
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState("");
    const [fileUrl, setFileUrl] = useState("");
  
    const getImage = async () => {
      if (!value || !value.length) return;
      const url = await moveTxService.retrieveFile(value);
      setFileUrl(url);
    };
  
    useEffect(() => {
      console.log("value", value);
      getImage();
    }, [value]);
  
    useEffect(() => {
      moveTxService.getOwnedFilesInfo("0xd989d8c55f5b28524efd20d6e4cab479686d28f3fc000fdb5d5fe40b52f1d8c2").then((files) => {
        console.log("files", files);
      });
    }, []);
  
    return (
      <div className="w-full  rounded-lg mt-4">
        <div
          className={`
            relative w-full h-14 bg-gray-100 rounded-xl
            ${
              isFocused
                ? "shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.7),inset_2px_2px_5px_rgba(0,0,0,0.1)]"
                : "shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.1)]"
            }
            transition-all duration-300 ease-in-out
          `}
        >
          <input
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full bg-transparent text-gray-700 px-4 outline-none rounded-lg"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        {fileUrl && (
          <img
            src={fileUrl}
            alt="Preview"
            className="w-full h-full object-contain rounded-lg"
          />
        )}
      </div>
    );
  };
  