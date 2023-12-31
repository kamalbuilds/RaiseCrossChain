import { Alert, Container, Grid, Paper, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { z } from "zod";
import DateForm from "../../components/DateForm";
import Form, { FormProps, FORM_ERROR } from "../../components/Form";
import LabeledTextField from "../../components/FormField";
import LabeledTextAreaField from "../../components/TextAreaForm";
import { useAppState } from "../context";
import { useAddress } from "@thirdweb-dev/react";
import { useContract , useContractWrite } from "@thirdweb-dev/react";
import { ethers } from "ethers";

export function CampaignForm<S extends z.ZodType<any, any>>(
  props: FormProps<S>
) {
  return (
    <Form<S> {...props}>
      <Container>
        <Paper shadow="sm" radius="md" p="xl" className="space-y-10">
          <Grid>
            <Grid.Col md={6}>
              <LabeledTextField
                name="name"
                label="Your Name"
                placeholder="write your name"
                required
              />
            </Grid.Col>
            <Grid.Col md={6}>
              <LabeledTextField
                name="title"
                label="Campaign Title"
                placeholder="Write a Title"
                required
              />
            </Grid.Col>
            <Grid.Col md={12}>
              <LabeledTextAreaField
                name="description"
                label="Information"
                placeholder="Give some information about your campaign"
                required
                minRows={5}
              />
            </Grid.Col>
            <Grid.Col md={6}>
              <LabeledTextField
                name="target"
                label="Goal"
                placeholder="ETH 0.005 "
                type="number"
                required
                precision={10}
                removeTrailingZeros
              />
            </Grid.Col>
            <Grid.Col md={6}>
              <DateForm
                type="date"
                name="deadline"
                label="End Date"
                placeholder="Pick a date"
                required
              />
            </Grid.Col>
            <Grid.Col md={12}>
              <LabeledTextField
                name="image"
                label="Campaign Image "
                placeholder="Place image url to represent your campaign"
                required
              />
            </Grid.Col>
            <Grid.Col md={12}>
              <LabeledTextField
                name="tokenaddress"
                label="ERC-20 Token Address"
                placeholder="Place ERC-20 Token Address to receive donations"
                required
              />
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </Form>
  );
}

export const CreateCampaignValidation = z.object({
  name: z.string().min(4),
  title: z.string().min(4),
  description: z.string().min(4),
  target: z.number().min(0.0000001),
  deadline: z.date(),
  image: z.string().url(),
  tokenaddress: z.string(),
});

export type CreateCampaignValidationType = z.infer<
  typeof CreateCampaignValidation
>;

const CreateCampaign = () => {
  const router = useRouter();
  const add = useAddress();

  const { contract } = useAppState();
  const { mutateAsync: createCampaign, isLoading } = useContractWrite(contract, "createCampaign")

  if (!add) {
    return (
      <div>
        <Alert color="red">
          You need to connect your wallet to create a campaign
        </Alert>
      </div>
    );
  }
  return (
    <div>
      <Title align="center" color="orange" order={1}>
        Start a Campaign
      </Title>
      <CampaignForm
        submitText="Submit new campaign"
        schema={CreateCampaignValidation}
        initialValues={{}}
        onSubmit={async (values) => {
          console.log(values);

          try {
            const targetValue = ethers.utils.parseUnits(values.target.toString(), 18); // Adjust the decimal precision as needed
            await createCampaign({ args: [add, values.title, values.description, targetValue, values.deadline.getTime(), values.image , values.tokenaddress] });

          } catch (error: any) {
            console.error(error);
            showNotification({
              title: "Something went wrong",
              message: "Failed to create campaign",
              color: "red",
            });
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />
    </div>
  );
};

export default CreateCampaign;
