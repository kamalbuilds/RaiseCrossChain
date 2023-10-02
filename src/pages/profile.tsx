import { Loader, Grid, Alert, Title } from "@mantine/core";
import { useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import DisplayCampaigns, {
  DisplayCampaignsCardProps,
} from "../../components/DisplayCampaigns";
import { useAppState } from "../context";
import SSXComponent from "../../components/SSXComponent";
import SpruceKitCredentialComponent from "../../components/SpruceKitCredentialComponent";
import { useContext, useEffect } from "react";
import { Web3NameContext } from "@/context/Web3NameContext";

const Profile = () => {
  const { contract, address, ssxProvider, chainid } = useAppState();
  const { data, isLoading } = useContractRead(contract, "getCampaigns");

  const { resolveNameBasedOnChainId, resolveWalletAddress, username } = useContext(Web3NameContext);

  const handleResolveName = async (username: string) => {
    //Params are chainid and username
    await resolveNameBasedOnChainId(chainid, username);
  }

  const resolveWalletAddresses = async (walletAddress: string) => {
    // const address = '0x88dC0cc038bF0A1D9a79E3E3Bb958A55882a838B';
    const address = walletAddress.toLowerCase();
    await resolveWalletAddress(chainid, address);

  }

  useEffect(() => {
    if (address) {
      console.log("UseEffect ran >>>")
      resolveWalletAddresses(address)
    }
  }, [address])


  if (!address) {
    return (
      <div>
        <Alert color="red">
          You need to connect your wallet to view the profile page
        </Alert>
        <SSXComponent />
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Title align="center" mb={20}>My Profile</Title>

          <div>
            <div>
              User Wallet address:{address}
            </div>

            <div>
              Username: {username}
            </div>


          </div>


          <h3>{chainid}</h3>
          <button className="border-2 p-2 mr-2" onClick={() => {
            if (username) {
              handleResolveName(username)
            }
          }}>Resolve Name</button>
          {/* <button className="border-2 p-2" onClick={resolveWalletAddresses}>REsolve address</button> */}



          <br />
          <SpruceKitCredentialComponent ssx={ssxProvider} />
          <br />
          <Title align="center" mb={20}>My Campaigns</Title>
          {data.filter((item: DisplayCampaignsCardProps) => item.owner === address)
            .length === 0 && (
              <Alert color="red">You have not created any campaigns</Alert>
            )}
          <Grid gutter={16} // Set the gutter value to control the space between columns
            gutterMd={24} // Adjust the gutter value for medium screen sizes
            gutterLg={32} // Adjust the gutter value for large screen sizes
            // @ts-ignore
            cols={{ xs: 1, sm: 2, md: 2, lg: 3 }} // Define the number of columns for different screen sizes
          >
            {data
              .filter((item: DisplayCampaignsCardProps) => item.owner === address)
              .map((item: DisplayCampaignsCardProps, i: number) => {
                return (
                  <Grid.Col span={4} key={i}> {/* Adjust the span value to control card width */}
                    <DisplayCampaigns
                      {...item}
                      target={ethers.utils.formatEther(item.target.toString())}
                      amountCollected={ethers.utils.formatEther(
                        item.amountCollected.toString()
                      )}
                      // @ts-ignore
                      deadline={new Date(item.deadline.toNumber())}
                    />
                  </Grid.Col>
                );
              })}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default Profile;
