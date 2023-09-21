import { Image, Navbar as NavbarMantine, NavLink } from "@mantine/core";
import { useRouter } from "next/router";
import { navlinks } from "../src/constants";
import { useDisconnect } from "@thirdweb-dev/react";

const Navbar = () => {
  const router = useRouter();
  const disconnect = useDisconnect();
  
  return (
    <NavbarMantine
      width={{ base: 180 }}
      className="flex flex-col justify-between"
    >
      <div className="my-6">
        <NavbarMantine.Section className="space-y-5">
          {navlinks.map((link) => (
            <div key={link.name} className="flex justify-center">
              <NavLink
                label={link.name}
                onClick={() => {
                  if (link.name === "logout") {
                    disconnect && disconnect();
                  } else {
                    router.push(link.link);
                  }
                }}
                className="rounded-full capitalize"
                icon={<Image src={link.imgUrl.src} alt="sidebar images" width={25} height={25} />}
              />
            </div>
          ))}
        </NavbarMantine.Section>
      </div>

    </NavbarMantine>
  );
};

export default Navbar;
