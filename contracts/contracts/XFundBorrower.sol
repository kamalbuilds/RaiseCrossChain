// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@unioncredit/v2-sdk/contracts/UnionBorrower.sol";
import "./CrowdFunding.sol";

contract XFundBorrower is Ownable, UnionBorrower {
    // These constructor properties coming from UnionBorrower
    constructor(address marketRegistry, address unionToken, address token)
        BaseUnionMember(marketRegistry, unionToken, token)
    {
        // Constructor initializes the contract with necessary addresses.
    }

    // Become a member of the lending and borrowing protocol.
    function registerMember() public onlyOwner {
        uint256 newMemberFee = userManager.newMemberFee();
        unionToken.transferFrom(msg.sender, address(this), newMemberFee);
        _registerMember();
    }

    // Borrow funds from the lending protocol.
    function borrow(uint256 amount) public {
        _borrow(amount);
        underlyingToken.transfer(msg.sender, amount);
    }

    // Repay borrowed funds to the lending protocol.
    function repayBorrow(uint256 amount) public {
        underlyingToken.transferFrom(msg.sender, address(this), amount);
        _repayBorrow(amount);
    }

    // Mint uTokens by supplying assets to the lending protocol.
    function mint(uint256 amount) public onlyOwner {
        underlyingToken.transferFrom(msg.sender, address(this), amount);
        _mint(amount);
    }

    // Redeem uTokens in exchange for the underlying asset.
    function redeem(uint256 amount) public onlyOwner {
        _redeem(amount);
        underlyingToken.transfer(msg.sender, underlyingToken.balanceOf(address(this)));
    }

    // Redeem uTokens for a specified amount of the underlying asset.
    function redeemUnderlying(uint256 amount) public onlyOwner {
        _redeemUnderlying(amount);
        underlyingToken.transfer(msg.sender, underlyingToken.balanceOf(address(this)));
    }

    // Function to fund a campaign by borrowing funds and donating them.
    function fundCampaign(
        address crowdfundingContract,
        bytes32 campaignId,
        uint256 amount
    ) public {
        // Retrieve campaign details from the CrowdFunding contract using getCampaign.
        CrowdFunding.Campaign memory campaign = CrowdFunding(crowdfundingContract).getCampaign(campaignId);

        require(
            campaign.deadline > block.timestamp,
            "Campaign deadline has passed"
        );

        // Borrow funds from the lending protocol.
        borrow(amount);

        // Transfer the borrowed funds to the campaign owner.
        payable(campaign.owner).transfer(amount);

        // Update the campaign's amount collected.
        campaign.amountCollected += amount;
    }
}
