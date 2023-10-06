# RaiseCrossChain - The Best Cross chain Crowdfunding Application with DID and ENS 🚀 

### Deployed Contract Addresses 

Wormhole - https://wormholescan.io/#/tx/154cccee7e9c433385f6d89d3f1935ebc92789682388a46cac8f5a69fd5f0cd5?network=TESTNET

Mumbai - https://mumbai.polygonscan.com/address/0xa75a8D0C1C244c8D1270432c90FAd41602BB041E

Avalanche - https://testnet.snowtrace.io/address/0x3a4e12933a3307f68782173abc3705df6f68378a

Gorelli - https://goerli.etherscan.io/address/0x3a59871DC0FEd5884374493D810a1439C2eca01F

Arbitrium - https://goerli-rollup-explorer.arbitrum.io/address/0xcb28933eED27d02Ab86f66668150187807AA47e8

### Video Demonstration


### Technologies used 

| **Feature/Module**                     | **Description**                                                                                       | **Usage**                                                                                                                                                         | **Link**                                     |
|---------------------------------------|-------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|
| **1. SpaceID for ENS Name Resolution across different chains and SpruceId for generating attestation**                    | Allows users to log in without a username and then resolves their ENS to use ENS as usernames.      | - User Authorization Module: Authenticate and authorize using supporters and campaign creators.<br> - Storage Module: Store data in Kepler Orbit.<br> - Rebase: Issue a BasicPostAttestation to generate an Onchain Verifiable Credential as proof of contribution.<br> - ENS Name Resolution: Resolves ENS names using Spruce SSX Component, and ENS is used as an identity on the platform. Supporters' addresses appear as ENS names when they donate.<br> - Union Protocol for Borrowing: Provides access to additional capital for users, enabling borrowing, repaying, and fund management for crowdfunding projects using the Union Protocol V2-SDK.                                              | [SpruceId Link](https://testnet.arbiscan.io/address/0x34Afb4Cb3EC4A273968bBa7267A06ff1A37Cd510) |
| **2. Account Abstraction**             | Helps users easily onboard without needing a wallet.                                                 | -                                                                                                                                   | [Account Abstraction Link](https://testnet.snowtrace.io/address/0x32AdE66Dcd63bC95A3215C53BF712423550593FB) |
| **3. ENS Name Resolution**            | Ens names are resolved using Space ID, and ENS is used as an identity on the platform. | ENS is used to recognize supporters when they donate; their address appears as an ENS name. ENS is resolved on Gorelli and ETH Chain.                                 |           [ENS Name](https://github.com/kamalbuilds/xfund/blob/master/src/context/index.tsx#L40)                               |
| **4. Union Protocol for Borrowing**   | Provides access to more capital for users through borrowing, funding, and repaying.                 | - **Access to Capital:** The `XFundBorrower` contract provides users with a way to access additional funds beyond their own available balance. This can be highly beneficial for users seeking to invest in or support multiple crowdfunding projects simultaneously.<br> - **Flexible Borrowing:** Users can tailor their borrowing amounts according to their specific needs for supporting crowdfunding projects. This flexibility allows them to allocate resources more precisely and efficiently.<br> - **Automated Loan Management:** By leveraging the Union Protocol SDK, the contract automates various aspects of the borrowing process, enhancing the user experience and reducing the complexity of interacting with the protocol.<br> - **Increased Participation:** Offering borrowing functionality through the `XFundBorrower` contract could potentially attract more users to the xfund platform. Users may be enticed by the ability to leverage their existing assets for greater crowdfunding participation.                                                                 | [XFundBorrower Contract](https://github.com/kamalbuilds/xfund/blob/master/contracts/contracts/XFundBorrower.sol)   |
| **5. Wormhole for Cross-Chain Donations**   | Enables cross-chain donations from supporters using the Wormhole protocol.             | - Cross-Chain Donations: Supporters can donate tokens from one blockchain to campaigns on another blockchain using the Wormhole protocol.<br> - Interoperability: Enhances the reach and accessibility of campaigns by allowing donations from various blockchain networks.<br> - Seamless Cross-Chain Transfers: Wormhole ensures a smooth and secure transfer of assets across different blockchains, expanding the campaign's potential donor base.<br> - Project Link: [RaiseCrossChain](https://github.com/kamalbuilds/RaiseCrossChain/tree/master/contracts/src/RaiseCrossChain) | [Wormhole Documentation](https://docs.wormhole.network/) |
                                   |

## Union Protocol V2-SDK used for uncollaterised funding of the projects

The `XFundBorrower` contract is a smart contract designed to integrate borrowing and repayment functionality for users on your xfund crowdfunding platform. The contract utilizes the Union Protocol SDK to facilitate the borrowing of funds using the native ETH token available on your platform. This contract provides a streamlined way for users to access additional funds for their crowdfunding endeavors and manage their borrowing activities.
