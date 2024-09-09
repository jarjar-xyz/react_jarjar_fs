import "./app.css";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createNetworkConfig } from "@mysten/dapp-kit";
import ReactGA from "react-ga4";
import { ServicesProvider } from "@/domain/core/services";
import { Home } from "./components/pages/Home/Home";

ReactGA.initialize("G-RPNVRXK9JB");
ReactGA.send({
  hitType: "pageview mint.jarjar.xyz/",
  page: "/",
  title: "mint.jarjar.xyz/",
});

const queryClient = new QueryClient();

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl("localnet") },
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={networkConfig}
        defaultNetwork={import.meta.env.VITE_SUI_NETWORK}
      >
        <ServicesProvider>
          <WalletProvider autoConnect>
            <Home />
          </WalletProvider>
        </ServicesProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
