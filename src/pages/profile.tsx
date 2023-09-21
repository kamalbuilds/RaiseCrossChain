import { Loader, Grid, Alert, Title } from "@mantine/core";
import { useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import DisplayCampaigns, {
  DisplayCampaignsCardProps,
} from "../../components/DisplayCampaigns";
import { useAppState } from "../context";
import SSXComponent from "../../components/SSXComponent";
import SpruceKitCredentialComponent from "../../components/SpruceKitCredentialComponent";

const Profile = () => {
  const { contract, address , ssxProvider } = useAppState();
  const { data, isLoading } = useContractRead(contract, "getCampaigns");

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
