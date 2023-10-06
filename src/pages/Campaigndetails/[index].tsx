import {
  Card,
  Container,
  Flex,
  Loader,
  LoadingOverlay,
  Progress,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useContractRead, useContractWrite, useContract, useAddress, extractFunctionsFromAbi, useChainId } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { z } from "zod";
import { DisplayCampaignsCardProps } from "../../../components/DisplayCampaigns";
import { FORM_ERROR } from "../../../components/Form";
import { FundForm } from "../../../components/FundForm";
import { useAppState } from "../../context";
import { calculateBarPercentage, daysLeft } from "../../utils";
import { SSX } from "@spruceid/ssx";
import { useContext, useState } from "react";
import KeplerStorageComponent from "../../../components/KeplerStorageComponent";
import RebaseCredentialComponent from "../../../components/RebaseCredentialComponent";
import { ChainId } from "@thirdweb-dev/react";
import { Web3NameContext } from "@/context/Web3NameContext";
import DonatorsList from "../../../components/DonatorsList";
import { utils } from "ethers";
export const CreateFundValidation = z.object({
  amount: z.number().min(0.0000001),
});

const CampaignDetails = () => {
  const router = useRouter();
  // const chainid = useChainId;
  const { index } = router.query;
  const address = useAddress();
  const { ssxProvider, chainid } = useAppState();

  console.log(ssxProvider, "ssxpr");
  const ssxaddress = ssxProvider?.address() || '';
  console.log(index);
  // earlier
  const { contract } = useAppState();

  // const { data, isLoading } = useContractRead(contract, "getCampaign", (index));

  const { data, isLoading } = useContractRead(contract, "getCampaign", [index]);
  console.log(data);

  const { mutateAsync: donateToCampaign, isLoading: donationloading } = useContractWrite(contract, "donateToCampaign");

  const { mutateAsync: donateTokensCrossChainToCampaign, isLoading: donatexchainloading } = useContractWrite(contract, "donateTokensCrossChainToCampaign")

  if (isLoading) {
    return <Loader />;
  }

  const typedState = {
    ...data,
    target: data?.target ? ethers.utils.formatEther(data.target.toString()) : '',
    amountCollected: data?.amountCollected ? ethers.utils.formatEther(data.amountCollected.toString()) : '',
    deadline: data?.deadline ? new Date(data.deadline.toNumber()) : null,
  } as DisplayCampaignsCardProps;

  console.log({ typedState });
  const percent = calculateBarPercentage(
    parseFloat(typedState.target),
    parseFloat(typedState.amountCollected)
  );

  // const { contract : erc20 } = useContract("0x326C977E6efc84E512bB9C30f76E30c160eD06FB");
  // const { mutateAsync: approve, isLoading : load } = useContractWrite(erc20, "approve")

  // const callerc20 = async () => {
  //   try {
  //     const data = await approve({ args: ["0xa75a8D0C1C244c8D1270432c90FAd41602BB041E", 2] });
  //     console.info("contract call successs", data);
  //   } catch (err) {
  //     console.error("contract call failure", err);
  //   }
  // }

  const call = async () => {
    try {
      // const data = await donateTokensCrossChainToCampaign({ args: [targetChain, targetContract, recipient, amount, token, _id] });

      const valueInWei = "18000000000000000";
      
      const data = await donateTokensCrossChainToCampaign(
        {
          args: [
            6,
            "0x2c852e740B62308c46DD29B982FBb650D063Bd07",
            "0xCF8D2Da12A032b3f3EaDC686AB18551D8fD6c132",
            "1000000000000000000",
            "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
            "0x72f6c77a48d3feeba1f23e4cda0eeb11935ac9e76e7fb403ed52339dbc0483c0",
          ],
          overrides: {
            gasLimit: 1000000, // override default gas limit
            value: utils.parseEther("0.018"), // send 0.1 native token with the contract call
          },
        },
      );
  
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }


  return (
    <Container>
      <Flex gap={5} justify="space-between">
        <div>
          <div>
            <img
              className="rounded-3xl  h-124 w-124  aspect-video"
              src={typedState.image}
              alt="Campaign"
            />
            <div className="flex space-x-5 items-center my-5">
              <Progress value={percent} className="w-full" />

              <Text className="whitespace-nowrap">{percent} %</Text>
            </div>
          </div>

          <Title order={1}>{typedState.title}</Title>
        </div>

        <div className="flex flex-col text-center space-y-5">
          <Card radius="xl" p={0}>
            <Title p={15} order={2}>
              {typedState.amountCollected}
            </Title>
            <Text bg="gray" p={15} className="rounded-lg mt-1 w-full">
              Raised of {typedState.target}{" "}
            </Text>
          </Card>

          <Card radius="xl" p={0}>
            <Title p={15} order={2}>
              {daysLeft(typedState.deadline)}
            </Title>
            <Text bg="gray" p={15} className="rounded-lg mt-1 w-full">
              Day left
            </Text>
          </Card>

          <Card radius="xl" p={0}>
            <Title p={15} order={2}>
              {typedState.donators?.length}
            </Title>
            <Text bg="gray" p={15} className="rounded-lg mt-1 w-full">
              Total Backers
            </Text>
          </Card>
        </div>
      </Flex>

      <div className="grid md:grid-cols-2 gap-5 ">
        <div>
          <div>
            <h2>Project ID {index} </h2>
            <Title order={3} mt={15}>
              Creator{" "}
            </Title>
            <Text>{typedState.owner}</Text>
          </div>
          <div>
            <Title order={3} mt={15}>
              ERC-20 Token Addresses for Donations
            </Title>
            <Text>{typedState.tokenAddress}</Text>
          </div>
          <div>
            <Title order={3} mt={15}>
              Story{" "}
            </Title>
            <Text>{typedState.description}</Text>
          </div>

          <div>
            <Title order={3} mt={15}>
              Donators{" "}
            </Title>

            {typedState.donators && typedState.donators.length > 0 ? (
              typedState.donators.map((donator: any) => <Text>
                <DonatorsList donator={donator} />
              </Text>)
            ) : (
              <Text>No donators yet. Be the first one! </Text>
            )}
          </div>
        </div>

        <div>
          <div className="my-6">
            {!address ? (
              <Text>You need to connect your wallet to fund this campaign</Text>
            ) : (
              <>
                <FundForm
                  submitText="Fund Campaign"
                  schema={CreateFundValidation}
                  initialValues={{}}
                  onSubmit={async (values) => {
                    try {
                        
                      await donateToCampaign({
                        args: [
                          typedState.id,
                        ],
                        overrides: {
                          gasLimit: 300000, // override default gas limit
                          value: ethers.utils.parseEther(values.amount.toString()),
                        },
                      });

                      showNotification({
                        title: "Successfully funded",
                        message: "Thank you for funding this campaign",
                        color: "green",
                      });
                    } catch (error: any) {
                      console.log(typedState.id, "id")
                      console.log({ error: error });
                      showNotification({
                        title: "Something went wrong",
                        message: "Failed to fund",
                        color: "red",
                      });
                      return {
                        [FORM_ERROR]: error.reason,
                      };
                    }
                  }}
                />
                {ssxProvider ? (
                  <>
                    <KeplerStorageComponent ssx={ssxProvider} />
                    <RebaseCredentialComponent ssx={ssxProvider} />
                  </>
                ) : (
                  <span className="my-4">SIWE to store to Kepler Storage and Generate Onchain Attestation for your Contributions</span>
                )}
              </>
            )}
          </div>
                  {/* <button onClick={callerc20}> Approve</button> */}
                  <button onClick={call}> Call</button>
        </div>
      </div>
    </Container>
  );
};

export default CampaignDetails;
