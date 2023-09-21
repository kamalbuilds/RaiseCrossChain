// @ts-nocheck
import React, { useState } from 'react';
import { ethers } from 'ethers';
import XFundBorrowerABI from '../constants/XFundBorrowerABI.json';
import { useAppState } from "../context";

export default function BorrowPage() {
  const [borrowAmount, setBorrowAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  const [fundingCampaignid, setFundingCampaignid] = useState('')
  const [transactionStatus, setTransactionStatus] = useState('');
  const [error, setError] = useState('');
  const { contract } = useAppState();

  const handleBorrow = async () => {
    try {
      setError('');
      setTransactionStatus('Transaction in progress...');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = 'YOUR_XFUNDBORROWER_CONTRACT_ADDRESS';
      const contract = new ethers.Contract(contractAddress, XFundBorrowerABI, signer);

      const tx = await contract.borrow(ethers.utils.parseEther(borrowAmount));
      await tx.wait();

      setTransactionStatus('Borrow successful!');
      setBorrowAmount('');
    } catch (err) {
      setError('Error borrowing funds. Please check your input and try again.');
    }
  };

  const handleRepay = async () => {
    try {
      setError('');
      setTransactionStatus('Transaction in progress...');

      // Similar to handleBorrow, but for repaying

      setTransactionStatus('Repayment successful!');
      setRepayAmount('');
    } catch (err) {
      setError('Error repaying funds. Please check your input and try again.');
    }
  };

  const handleFund = async () => {
    try {
      setError('');
      setTransactionStatus('Transaction in progress...');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = 'YOUR_XFUNDBORROWER_CONTRACT_ADDRESS';
      const contract = new ethers.Contract(contractAddress, XFundBorrowerABI, signer);

      const tx = await contract.fundCampaign(contract, fundingCampaignid, ethers.utils.parseEther(fundAmount));
      await tx.wait();

      setTransactionStatus('Funding successful 🚀 !');
      setFundAmount('');
    } catch (err) {
      setError('Error funding the campaign. Please check your input and try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">XFund 🤝 Union Borrow & Repay</h1>

      <div className="mb-4">
        <label className="block font-medium">Borrow Amount (ETH)</label>
        <input
          type="number"
          value={borrowAmount}
          onChange={(e) => setBorrowAmount(e.target.value)}
          className="block w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handleBorrow}
        className="bg-blue-500 text-white px-4 py-2 rounded font-medium"
      >
        Borrow
      </button>

      <div className="mt-2 text-green-600">{transactionStatus}</div>
      <div className="mt-2 text-red-600">{error}</div>

      <div className="mt-6">
        <label className="block font-medium">Funding Campaign ID ?</label>
        <input
          type="string"
          value={fundingCampaignid}
          onChange={(e) => setFundingCampaignid(e.target.value)}
          className="block w-full p-2 border rounded"
        />

      </div>

      <div className="mt-6">
        <label className="block font-medium">Funding Amount ? (ETH)</label>
        <input
          type="number"
          value={fundAmount}
          onChange={(e) => setFundAmount(e.target.value)}
          className="block w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handleFund}
        className="bg-purple-500 text-white px-4 py-2 rounded font-medium mt-4"
      >
        Fund Campaign
      </button>

      <div className="mt-6">
        <label className="block font-medium">Repay Amount (DAI)</label>
        <input
          type="number"
          value={repayAmount}
          onChange={(e) => setRepayAmount(e.target.value)}
          className="block w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handleRepay}
        className="bg-green-500 text-white px-4 py-2 rounded font-medium mt-4"
      >
        Repay
      </button>
    </div>
  );
}
