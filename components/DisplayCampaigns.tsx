import { Card, Grid, Group, Image, Text } from "@mantine/core";
import React from "react";
import { useRouter } from "next/router";

export interface DisplayCampaignsCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  target: string;
  deadline: Date;
  amountCollected: string;
  owner: string;
  donators: string[];
  tokenAddress: string;
}

const DisplayCampaigns: React.FC<DisplayCampaignsCardProps> = (item) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/Campaigndetails/${item.id}`);
  };

  return (
    
    <Card
      onClick={handleCardClick}
      className="cursor-pointer hover:transform hover:scale-105 transition-all duration-300 mx-2 p-4 hover:cursor-pointer"
      shadow="sm"
      radius="md"
    >
      <Card.Section>
        <Image src={item.image} height={160} alt="Norway" />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{item.title}</Text>
        <Text weight={500}>ETH {item.target}</Text>
      </Group>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>End Date :</Text>
        <Text weight={500}>{item.deadline.toDateString()}</Text>
      </Group>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>Total collected amount:</Text>
        <Text weight={500}>ETH {item.amountCollected}</Text>
      </Group>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>Owner by</Text>
        <Text weight={500}>{item.owner.substring(0, 10)}...</Text>
      </Group>

      <Text size="sm" color="dimmed">
        {item.description}
      </Text>
    </Card>
    
  );
};

export default DisplayCampaigns;