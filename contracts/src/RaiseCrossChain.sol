// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "wormhole-solidity-sdk/WormholeRelayerSDK.sol";

contract RaiseCrossChain is TokenSender, TokenReceiver {

    struct Campaign {
        bytes32 id;
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        address tokenAddress; // Address of the ERC-20 token used for donations
    }

    mapping(bytes32 => Campaign) public campaigns;
    bytes32[] public listCampaignsID;
    uint256 public numberOfCampaigns = 0;

    uint256 constant GAS_LIMIT = 250_000;

    constructor(address _wormholeRelayer, address _tokenBridge, address _wormhole)
        TokenBase(_wormholeRelayer, _tokenBridge, _wormhole)
    {}

    // autorelayer , tokenbridge, wormholecore
    
    function generateUUID() public view returns (bytes32) {
        return keccak256(abi.encodePacked(block.timestamp, msg.sender, numberOfCampaigns));
    }

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image,
        address _tokenAddress // Address of the ERC-20 token
    ) public returns (uint256) {
        bytes32 id = generateUUID();
        Campaign storage campaign = campaigns[id];
        listCampaignsID.push(id);

        require(_deadline > block.timestamp, "Deadline must be in the future");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.image = _image;
        campaign.amountCollected = 0;
        campaign.id = id;
        campaign.tokenAddress = _tokenAddress; // Set the ERC-20 token address

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function quoteCrossChainDeposit(uint16 targetChain) public view returns (uint256 cost) {
        uint256 deliveryCost;
        (deliveryCost,) = wormholeRelayer.quoteEVMDeliveryPrice(targetChain, 0, GAS_LIMIT);
        cost = deliveryCost + wormhole.messageFee();
    }

    function donateTokensCrossChainToCampaign(
        uint16 targetChain, // Target chain ID
        address targetContract, // Address of the HelloToken contract on the target chain
        address recipient, // Recipient address on the target chain
        uint256 amount, // Amount of tokens to send
        address token, // Address of the ERC-20 token
        bytes32 _id // ID of the campaign
    ) public payable {
        Campaign storage campaign = campaigns[_id];

        uint256 cost = quoteCrossChainDeposit(targetChain);
        require(msg.value == cost, "Incorrect ETH value provided");

        // Transfer tokens from the sender to this contract
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        // Encode the recipient address into a payload
        bytes memory payload = abi.encode(recipient);

        // Send tokens and payload to the target chain
        sendTokenWithPayloadToEvm(
            targetChain,
            targetContract,
            payload,
            0, // Receiver value (usually 0)
            GAS_LIMIT, // Gas limit
            token,
            amount
        );

        // Step 3: Update donation records
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        campaign.amountCollected += amount;
    }
    
    // donate native token to campaign
    function donateToCampaign(bytes32 _id ) public payable {
        Campaign storage campaign = campaigns[_id];

        require(msg.value > 0, "Donation must be greater than 0");

        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);
        campaign.amountCollected += msg.value;
    }

    function receivePayloadAndTokens(
        bytes memory payload,
        TokenReceived[] memory receivedTokens,
        bytes32,
        uint16,
        bytes32
    ) internal override onlyWormholeRelayer {
        require(receivedTokens.length > 0, "Expected atleast 1 token transfer");

        address recipient = abi.decode(payload, (address));
        IERC20(receivedTokens[0].tokenAddress).transfer(recipient, receivedTokens[0].amount);
    }

    function getDonators(bytes32 _id)
        public
        view
        returns (address[] memory, uint256[] memory)
    {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory _campaigns = new Campaign[](listCampaignsID.length);

        for (uint256 i = 0; i < listCampaignsID.length; i++) {
            _campaigns[i] = campaigns[listCampaignsID[i]];
        }
        return _campaigns;
    }

    function getCampaign(bytes32 _id) public view returns (Campaign memory) {
        return campaigns[_id];
    }

    function withdrawFunds(bytes32 _id) public {
        Campaign storage campaign = campaigns[_id];

        require(campaign.id == _id, "Campaign not found");
        require(msg.sender == campaign.owner, "Only the campaign owner can withdraw funds");
        require(campaign.amountCollected >= campaign.target, "Campaign target not reached");

        uint256 amountToWithdraw = campaign.amountCollected;
        campaign.amountCollected = 0;
        payable(msg.sender).transfer(amountToWithdraw);
    }
}
