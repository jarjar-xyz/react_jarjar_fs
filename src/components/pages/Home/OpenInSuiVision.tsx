import { useServices } from "@/domain/core/services";
import { useObservable } from "micro-observables";

export const OpenInSuiVision = () => {
  const { moveTxService } = useServices();

  const fileObjectId = useObservable(moveTxService.fileObjectId);

  return (
    <div>
      {fileObjectId && (
        <a
          href={`https://mainnet.suivision.xyz/object/${fileObjectId}`}
          target="_blank"
        >
          <h3 className="text-2xl p-4 text-center underline text-blue-800">
            Open in Sui Vision
          </h3>
        </a>
      )}
    </div>
  );
};
