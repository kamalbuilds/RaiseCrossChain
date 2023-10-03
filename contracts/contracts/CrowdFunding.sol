// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

// Import the ERC-20 interface
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CrowdFunding {
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
    mapping(bytes32 => mapping(address => uint256)) public approvedAllowance; // id1 -> (0x123 -> 10 tokens) allow

    bytes32[] public listCampaignsID;

    uint256 public numberOfCampaigns = 0;

    function generateUUID() public view returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(block.timestamp, msg.sender, numberOfCampaigns)
            );
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

        require(
            _deadline > block.timestamp,
            "Deadline must be in the future"
        );

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

    // Function to approve token allowance
    function approveTokenAllowance(bytes32 _id, uint256 _amount) public {
        Campaign storage campaign = campaigns[_id];

        // Get the ERC-20 token
        IERC20 token = IERC20(campaign.tokenAddress);

        // Approve allowance for this contract to spend tokens on behalf of the sender
        require(
            token.approve(address(this), _amount),
            "Approval failed"
        );

        // Store the approved allowance
        approvedAllowance[_id][msg.sender] = _amount;
    }

    // Donate using ERC-20 tokens
    function donateTokensToCampaign(bytes32 _id, uint256 _amount) public {
        Campaign storage campaign = campaigns[_id];

        // Step 1: Check if an allowance has been approved
        require(
            approvedAllowance[_id][msg.sender] >= _amount,
            "Token allowance not approved"
        );

        // Get the ERC-20 token
        IERC20 token = IERC20(campaign.tokenAddress);

        // Step 2: Transfer tokens from the sender to this contract
        require(
            token.transfer(address(this), _amount),
            "Token transfer failed"
        );

        // Step 3: Update donation records
        campaign.donators.push(msg.sender);
        campaign.donations.push(_amount);
        campaign.amountCollected += _amount;
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

    // Function to allow the campaign owner to withdraw funds
    function withdrawFunds(bytes32 _id) public {
        Campaign storage campaign = campaigns[_id];

        // Ensure that the campaign exists and that the sender is the owner
        require(campaign.id == _id, "Campaign not found");
        require(msg.sender == campaign.owner, "Only the campaign owner can withdraw funds");

        // Ensure that the campaign has met its target
        require(campaign.amountCollected >= campaign.target, "Campaign target not reached");

        // Transfer the funds to the campaign owner
        uint256 amountToWithdraw = campaign.amountCollected;
        campaign.amountCollected = 0; // Reset the amount collected
        payable(msg.sender).transfer(amountToWithdraw);
    }
}
