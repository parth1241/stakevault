import { Horizon } from '@stellar/stellar-sdk';

const horizon = new Horizon.Server(process.env.NEXT_PUBLIC_STELLAR_HORIZON || 'https://horizon-testnet.stellar.org');

export async function getWalletBalance(address: string): Promise<number> {
  try {
    const account = await horizon.loadAccount(address);
    const nativeBalance = account.balances.find((b) => b.asset_type === 'native');
    return nativeBalance ? parseFloat(nativeBalance.balance) : 0;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return 0;
  }
}

export async function getTransactionHistory(address: string) {
  try {
    const payments = await horizon
      .payments()
      .forAccount(address)
      .order('desc')
      .limit(20)
      .call();
    return payments.records;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
}
