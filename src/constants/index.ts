import {
  createCampaign,
  dashboard,
  logout,
  payment,
  profile,
  withdraw,
  notifications,
  chainlink,
} from "../assets";

export const navlinks = [
  {
    name: "dashboard",
    imgUrl: dashboard,
    link: "/",
  },
  {
    name: "campaign",
    imgUrl: createCampaign,
    link: "/CreateCampaign",
  },
  {
    name: "analyse",
    imgUrl: chainlink,
    link: "/analyse",
  },
  {
    name: "my camps",
    imgUrl: profile,
    link: "/profile"
  },
  {
    name: "Union Credit",
    imgUrl: withdraw,
    link: "/borrow",
  },
];
