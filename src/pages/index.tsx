// @ts-nocheck
import { Flex, Grid, Loader, Title } from "@mantine/core";
import { useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import DisplayCampaigns, {
  DisplayCampaignsCardProps,
} from "../../components/DisplayCampaigns";
import { useAppState } from "../context";

const Home = () => {
  const { contract } = useAppState();
  const { data, isLoading } = useContractRead(contract, "getCampaigns");
  const { ssxProvider } = useAppState();


  return (
    <div>
      <Title align="center" mb={20}>
        All Campaigns
      </Title>

      {isLoading ? (
        <Loader />
      ) : (
        <Flex
          direction={{ base: "column" }}
          gap={{ base: "sm", sm: "lg" }}
          justify={{ sm: "center" }}
        >
          <Grid gutter={16} // Set the gutter value to control the space between columns
            gutterMd={24} // Adjust the gutter value for medium screen sizes
            gutterLg={32} // Adjust the gutter value for large screen sizes
            cols={{ xs: 1, sm: 2, md: 2, lg: 3 }}
          >
            {data.map((item: DisplayCampaignsCardProps, i: number) => {
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
        </Flex>
      )}
    </div>
  );
};

export default Home;
