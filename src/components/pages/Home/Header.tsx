import { useServices } from "@/domain/core/services";
import { truncateAddress } from "@/lib/utils";
import {
  ConnectModal,
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  const currentAccount = useCurrentAccount();
  const [open, setOpen] = useState(false);
  const { mutate: signAndExecuteTx } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const { moveTxService } = useServices();

  useEffect(() => {
    currentAccount?.address && console.log("addre", currentAccount?.address);
    currentAccount?.address && (moveTxService.userAddress = currentAccount?.address);

    moveTxService.signAndExecute = signAndExecuteTx;
    moveTxService.suiClient = suiClient;
  }, [currentAccount, signAndExecuteTx, suiClient]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="flex flex-col items-center md:items-start w-full md:w-auto mb-4 md:mb-0">
        <h1 className="mb-0 text-2xl md:text-3xl">JarJarFS</h1>
        <p className="text-gray-400 text-sm md:text-base">Store any file on the Sui blockchain.</p>
      </div>

      <div className="flex md:flex-row items-center w-full md:w-auto space-y-2 md:space-y-0 md:space-x-4 justify-evenly">
        <Link to="/" className="mr-2">
          <div className="btn w-full md:w-auto">Upload</div>
        </Link>
        <Link to="/library" className="mr-2">
          <div className="btn w-full md:w-auto">Library</div>
        </Link>
        <span>
        <div className="btn w-full md:w-auto" onClick={() => setOpen(true)}>
          {currentAccount
            ? truncateAddress(currentAccount.address)
            : "Connect Wallet"}
        </div>
        </span>
      </div>
      <ConnectModal
        trigger
        open={open}
        onOpenChange={(open) => setOpen(open)}
      />
    </div>
  );
};
