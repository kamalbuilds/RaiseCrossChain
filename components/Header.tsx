import {
  ActionIcon,
  Avatar,
  Button,
  Header as HeaderMantine,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ologo, thirdweb } from "../src/assets";
import { ConnectWallet } from "@thirdweb-dev/react";
import Image from "next/image";
import { useAppState } from "@/context";
import SSXComponent from "./SSXComponent";

const Header = () => {
  const router = useRouter();
  const { ens } = useAppState();

  return (
    <HeaderMantine height={80} p="xs" style={{ backgroundColor: "transparent" }}>
      <div className="flex" style={{ justifyContent: "space-between" }}>
        <div className="flex items-center space-x-5 p-2 rounded-lg">
          <Image src={ologo} height={100} width={50} alt="logo" />
          <TextInput
            rightSection={
              <ActionIcon>
                <IconSearch />
              </ActionIcon>
            }
            w={300}
            placeholder="Search..."
            value={""}
            onChange={(e) => {}}
          />
          <Link href="/profile">
            {ens ? (
              <Avatar src={ens.avatarUrl} alt="it's me" radius="xl" />
            ) : (
              <Avatar src="null" alt="it's me" radius="xl" />
            )}
          </Link>
        </div>

        {ens && ens.domain ? (
          <h2 className="text-emerald-100 box-border p-2 border-4">{ens.domain}</h2>
        ) : null}
        <div className="flex gap-4">
          <SSXComponent />
          <br />
          <ConnectWallet />
        </div>
      </div>
    </HeaderMantine>
  );
};

export default Header;
