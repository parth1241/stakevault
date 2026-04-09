import {
  Contract, rpc, TransactionBuilder, Networks,
  BASE_FEE, xdr, nativeToScVal
} from '@stellar/stellar-sdk'
import { signTransaction } from '@stellar/freighter-api'

const rpcServer = new rpc.Server(process.env.NEXT_PUBLIC_SOROBAN_RPC!)
const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID!
const networkPassphrase = Networks.TESTNET

export async function buildAndSign(sourcePublicKey: string, operation: xdr.Operation) {
  try {
    const sourceAccount = await rpcServer.getAccount(sourcePublicKey);
    
    const tx = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    const preparedTx = await rpcServer.prepareTransaction(tx);
    const xdrString = preparedTx.toXDR();

    const { signedTxXdr, error } = await signTransaction(xdrString, {
      networkPassphrase,
    });

    if (error) {
       throw new Error(`Freighter signing failed: ${error}`);
    }

    const response = await rpcServer.sendTransaction(TransactionBuilder.fromXDR(signedTxXdr, networkPassphrase));

    if (response.status !== 'PENDING') {
      throw new Error(`Transaction failed with status: ${response.status}`);
    }

    // Poll for status
    let status = 'PENDING';
    let result: string | null = null;
    const txHash = response.hash;

    while (status === 'PENDING') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const txDetails = await rpcServer.getTransaction(txHash);
      status = txDetails.status;
      if (status === 'SUCCESS') {
        result = (txDetails as rpc.Api.GetSuccessfulTransactionResponse).resultMetaXdr.toXDR().toString('base64');
      } else if (status === 'FAILED') {
        throw new Error('Transaction execution failed on-chain');
      }
    }

    return { txHash, result, status };
  } catch (error) {
    console.error('Soroban transaction error:', error);
    throw error;
  }
}

export async function stakeXLM(stakerPublicKey: string, amountXLM: number, lockPeriodDays: number) {
  const contract = new Contract(contractId);
  const operation = contract.call(
    'stake',
    nativeToScVal(stakerPublicKey, { type: 'address' }),
    nativeToScVal(BigInt(Math.round(amountXLM * 10000000)), { type: 'i128' }),
    nativeToScVal(lockPeriodDays, { type: 'u32' })
  );

  const { txHash } = await buildAndSign(stakerPublicKey, operation);
  
  // In a real contract, we'd parse the result to get the positionId
  // For simulation, we'll return a random ID or wait for backend state
  return { txHash, positionId: Math.floor(Math.random() * 1000000) };
}

export async function unstakeXLM(stakerPublicKey: string, positionId: number) {
  const contract = new Contract(contractId);
  const operation = contract.call(
    'unstake',
    nativeToScVal(stakerPublicKey, { type: 'address' }),
    nativeToScVal(positionId, { type: 'u32' })
  );

  return await buildAndSign(stakerPublicKey, operation);
}

export async function claimYield(stakerPublicKey: string, positionId: number) {
  const contract = new Contract(contractId);
  const operation = contract.call(
    'claim_yield',
    nativeToScVal(stakerPublicKey, { type: 'address' }),
    nativeToScVal(positionId, { type: 'u32' })
  );

  return await buildAndSign(stakerPublicKey, operation);
}

export async function emergencyWithdraw(stakerPublicKey: string, positionId: number) {
  const contract = new Contract(contractId);
  const operation = contract.call(
    'emergency_withdraw',
    nativeToScVal(stakerPublicKey, { type: 'address' }),
    nativeToScVal(positionId, { type: 'u32' })
  );

  return await buildAndSign(stakerPublicKey, operation);
}

export async function getPosition(positionId: number) {
  try {
    const contract = new Contract(contractId);
    // Simulation logic as read-only call
    // const operation = contract.call('get_position', nativeToScVal(positionId, { type: 'u32' }));
    
    // For read-only, we usually use simulateTransaction
    // This is a simplified fetch for the UI
    return { 
      positionId, 
      staker: 'G...', 
      amount: 100, 
      lockPeriod: 30, 
      stakedAt: new Date(), 
      unlocksAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
      yield: 2.5 
    };
  } catch (error) {
    console.error('Error fetching position:', error);
    return null;
  }
}

export async function getContractStats() {
  try {
    // Read-only call simulation
    return { 
      totalStaked: 4291.50, 
      totalStakers: 124, 
      totalYieldPaid: 850.25, 
      isActive: true 
    };
  } catch (error) {
    console.error('Error fetching contract stats:', error);
    return { totalStaked: 0, totalStakers: 0, totalYieldPaid: 0, isActive: false };
  }
}

export async function fundWithFriendbot(address: string) {
  try {
    const response = await fetch(`https://friendbot.stellar.org?addr=${address}`);
    return { success: response.ok };
  } catch (error) {
    console.error('Friendbot error:', error);
    return { success: false };
  }
}
