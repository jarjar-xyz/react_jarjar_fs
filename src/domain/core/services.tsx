import { createContext, useContext } from "react";
// import { ApiService } from "./api.service";
import { MoveTxService } from "../services/move-tx.service";
import { DropzoneService } from "../services/dropzone.service";
import { WalrusApi } from "../services/walrus.api";
import { FileStorageService } from "../services/fileStorage.service";

// const apiService = new ApiService();
const walrusApi = new WalrusApi();
const fileStorageService = new FileStorageService();
const moveTxService = new MoveTxService(walrusApi, fileStorageService);
const dropzoneService = new DropzoneService(moveTxService);

export const services = {
  moveTxService,
  dropzoneService,
  fileStorageService,
  walrusApi,
};

export type Services = typeof services;
export const ServicesContext = createContext<Services | null>(null);
export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};

export function useServices(): Services {
  const services = useContext(ServicesContext);
  if (!services) {
    throw Error("ServiceContext not defined");
  }
  return services;
}
