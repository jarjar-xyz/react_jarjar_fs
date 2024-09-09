import { useServices } from "@/domain/core/services";
import { useObservable } from "micro-observables";

export const NeuromorphicProgressBar = ({
  minWidth = "250px",
  maxWidth = "100%",
}) => {
  const { moveTxService } = useServices();
  const percentage = useObservable(moveTxService.uploadProgress);

  if (percentage === 0) {
    return <div className="w-full max-w-full mx-auto mt-2 mb-4" />;
  }

  return (
    <div className="w-full max-w-full mx-auto mt-2 mb-3">
      <div
        className="relative bg-gray-200 rounded-full p-1 shadow-inner w-full h-4 sm:h-6 md:h-8"
        style={{
          minWidth: minWidth,
          maxWidth: maxWidth,
        }}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-gray-300 to-gray-500 transition-all duration-300 ease-in-out shadow-lg"
          style={{
            width: `${percentage}%`,
            boxShadow:
              "3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.8)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm md:text-base font-semibold text-gray-700">
          {percentage}%
        </div>
      </div>
    </div>
  );
};
