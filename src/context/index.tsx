// @ts-nocheck
import { showNotification } from "@mantine/notifications";
import {
  useAddress,
  useContract,
  useContractWrite
} from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import { BaseContract, ethers } from "ethers";
import React, { createContext, useContext, useState, useEffect } from "react";
import { CreateCampaignValidationType } from "../pages/CreateCampaign";
import { useChainId } from "@thirdweb-dev/react";

interface StateContextType {
  address?: string;
  contract?: SmartContract<BaseContract> | undefined;
  createCampaign?: (values: CreateCampaignValidationType) => Promise<void>;
  createCampaignIsLoading?: boolean;
  createCampaignError?: unknown;
  ens: {
    domain: string | null;
    avatarUrl: string | null;
  };
  lens?: string | null; // Add lens
  ssxProvider?: any;
  setSsxProvider?: any;
  setEns?: any;
  chainid: number
}


const StateContext = createContext<StateContextType>({});

interface StateProviderProps {
  children: React.ReactNode;
}

export const StateProvider = ({ children }: StateProviderProps) => {
  const chainid = useChainId();
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [ens, setEns] = useState<{ domain: string | null; avatarUrl: string | null }>({
    domain: null,
    avatarUrl: null,
  });
  const [lens, setLens] = useState<{ /* Define the properties of the lens object here */ }>({
    // Initialize lens properties here
  });
  const [ssxProvider, setSsxProvider] = useState<SSX | null>(null);

  useEffect(() => {
    let currentContractAddress;
    switch (chainid) {
      case 421613:
        currentContractAddress = "0x18eEb61fB8F03be2f9B91Db2683db4d473ba5585"; // arb
        break;
      case 43113:
        currentContractAddress = "0x32AdE66Dcd63bC95A3215C53BF712423550593FB"; // avalanche
        break;
      case 80001:
        currentContractAddress = "0xa75a8D0C1C244c8D1270432c90FAd41602BB041E"; // matic
        break;
      default:
        console.log(chainid, "i m here");
        currentContractAddress = "0x32AdE66Dcd63bC95A3215C53BF712423550593FB";
    }
    setContractAddress(currentContractAddress);
  }, [chainid]);

  console.log(contractAddress, ens, "address and ens kamal");

  const { contract } = useContract(contractAddress);
  console.log(contract, "c");
  const {
    mutateAsync: createCampaign,
    isLoading,
    error,
  } = useContractWrite(contract, "createCampaign");

  const address = useAddress();

  const handleCreateCampaign = async (values: CreateCampaignValidationType) => {
    console.log(values, "v")
    try {
      const data = await createCampaign(
        address,
        values.title,
        values.description,
        ethers.utils.parseUnits(values.target.toString(), 18),
        values.deadline.getTime(),
        values.image,
      );

      showNotification({
        title: "Success",
        message: "Campaign created",
        color: "blue",
      });

      return data;
    } catch (error: any) {
      console.error(error);
      showNotification({
        title: "something went wrong",
        message: "Failed to create campaign",
        color: "red",
      });
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        createCampaign: handleCreateCampaign,
        createCampaignIsLoading: isLoading,
        createCampaignError: error,
        setEns,
        ens,
        setLens,
        lens,
        ssxProvider,
        setSsxProvider,
        chainid
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext<StateContextType>(StateContext);
