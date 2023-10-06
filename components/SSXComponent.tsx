"use client";
import { SSX } from "@spruceid/ssx";
import { useState, useEffect } from "react";
import { useChainId } from "@thirdweb-dev/react";
import { useAppState } from "@/context";

const SSXComponent = () => {

  const chainid = useChainId();
  const [checkens, setCheckens] = useState<boolean>(false);
  const [checklens, setChecklens] = useState<boolean>(false);
  // const [ens , SetEns] = useState();
  const { setEns , ens , setSsxProvider , ssxProvider} = useAppState();

  useEffect(() => {
    if (chainid === 1 || chainid == 5) {
      setCheckens(true);
    } else if (chainid === 137 || chainid === 80001) {
      setChecklens(true);
    }
  }, [chainid]);

  const ssxHandler = async () => {
    const ssx = new SSX({
      providers: {
        server: {
          host: "https://raisexchain.vercel.app/api"
        }
      },
      resolveEns: checkens,
      resolveLens: checklens,
      modules: {
        storage: {
          prefix: 'raisexchain',
          hosts: ['https://kepler.spruceid.xyz'],
          autoCreateNewOrbit: true
        },
        credentials: true
      }
    });

    const obj = await ssx.signIn();
    const { lens } = obj;
    const { ens } = obj;
    setEns(ens);
    console.log(obj, lens, "dsf");
    setSsxProvider(ssx);
  };

  const ssxLogoutHandler = async () => {
    ssxProvider?.signOut();
    setSsxProvider(null);
  };
  console.log(ens, "ssxpr")

  return (
    <>
    <div style={{ backgroundColor: "transparent", display: "inline-block" }} className="my-4">
      {ssxProvider ? (
        <>
          <button className="SIWEbutton" onClick={ssxLogoutHandler}>
            <span>Sign-Out</span>
          </button>
          <br />
          {/* <SpruceKitCredentialComponent ssx={ssxProvider} /> */}
        </>
      ) : (
        <button className="SIWEbutton" onClick={ssxHandler}>
          <span>Sign-In with Ethereum</span>
        </button>
      )}
      </div>
    </>
  );
};

export default SSXComponent;
