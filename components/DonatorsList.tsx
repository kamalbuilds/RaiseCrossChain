import { useAppState } from '@/context';
import { Web3NameContext } from '@/context/Web3NameContext';
import React, { useContext, useEffect, useState } from 'react';

const DonatorsList = ({
    donator
}: any) => {

    const { resolveWalletAddress, username } = useContext(Web3NameContext);
    const { chainid } = useAppState();
    const [isLoading, setIsLoading] = useState(false);

    const resolveWalletAddresses = async (walletAddress: string) => {
        setIsLoading(true);
        const address = walletAddress.toLowerCase();
        await resolveWalletAddress(chainid, address);

        setIsLoading(false);

    }

    useEffect(() => {
        if (donator) {
            resolveWalletAddresses(donator);
        }
    }, [])

    console.log("User name", username)




    return (
        <div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                username
            )}
        </div>
    );
};

export default DonatorsList;