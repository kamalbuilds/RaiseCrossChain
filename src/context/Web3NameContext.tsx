import { createContext, useState } from 'react';
const SID = require('@siddomains/sidjs').default;
const ethers = require('ethers');
const SIDfunctions = require('@siddomains/sidjs');

let sid

type Web3NameContext = {
    resolveNameBasedOnChainId: (chainid: number, name: string) => void,
    resolveWalletAddress: (chainid: number, address: string) => void,
    username: string
}

const initialState = {
    resolveNameBasedOnChainId: async (chainid: number, name: string) => { },
    resolveWalletAddress: async (chainid: number, address: string) => { },
    username: ''
}

export const Web3NameContext = createContext<Web3NameContext>(initialState);

export const Web3NameContextProvider = ({ children }: { children: JSX.Element }) => {

    const [username, setUserName] = useState('');

    const getProvider = (chainid: number) => {

        let rpc = '';
        switch (chainid) {
            case 1:
                rpc = ''
                break;
            case 5:
                rpc = 'https://eth-goerli.g.alchemy.com/v2/T-0GbHJJhTqF3V5iTTlhB49fGE9RB_x3'
                break;
            case 42161:
                rpc = 'https://arb-mainnet.g.alchemy.com/v2/UBBOe4o5xBdu3ZSm73Ty2dOmDIQh696X'
                break;
            case 97:
                rpc = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
                break;
            default:
                break;
        }

        const provider = new ethers.providers.JsonRpcProvider(rpc)

        return provider;
    }


    const resolveNameBasedOnChainId = async (chainid: number, name: string) => {
        try {
            const provider = getProvider(chainid);
            console.log("Provider", provider, chainid);
            sid = new SID({ provider, sidAddress: SIDfunctions.getSidAddress(chainid) })
            const address = await sid.name(name).getAddress() // 0x123    
            console.log("Address", address);
            console.log("name: %s, address: %s", name, address)
        } catch (error) {
            console.log("Error", error);
        }
    }

    const resolveWalletAddress = async (chainid: number, address: string) => {
        const provider = getProvider(chainid);
        console.log("Provider", provider, chainid);
        sid = new SID({ provider, sidAddress: SIDfunctions.getSidAddress(chainid) })

        const name = await sid.getName(address);
        setUserName(name.name);
        console.log("Name", name);
        console.log("name: ", name, address);

    }

    return (
        <Web3NameContext.Provider value={{
            resolveNameBasedOnChainId,
            resolveWalletAddress,
            username
        }}>
            {children}
        </Web3NameContext.Provider>

    )
}
