import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        vanalisPackageId: import.meta.env.VITE_DEVNET_VANALIS_PACKAGE_ID,
        projectRegistryObjectId: import.meta.env.VITE_PROJECT_REGISTRY_OBJECT_ID,
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        vanalisPackageId: import.meta.env.VITE_TESTNET_VANALIS_PACKAGE_ID,
        projectRegistryObjectId: import.meta.env.VITE_PROJECT_REGISTRY_OBJECT_ID,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        vanalisPackageId: import.meta.env.VITE_MAINNET_VANALIS_PACKAGE_ID,
        projectRegistryObjectId: import.meta.env.VITE_PROJECT_REGISTRY_OBJECT_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
