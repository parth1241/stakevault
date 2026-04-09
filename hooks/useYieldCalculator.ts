import { useMemo } from 'react';

interface YieldParams {
  amountXLM: number;
  lockPeriodDays: number;
  apyRate: number;
}

export function useYieldCalculator({ amountXLM, lockPeriodDays, apyRate }: YieldParams) {
  return useMemo(() => {
    if (!amountXLM || !lockPeriodDays || !apyRate) {
      return { projectedYield: 0, dailyYield: 0, totalReturn: 0, breakEvenDays: 0 };
    }

    // yield = amount * apy * (lockDays/365)
    const projectedYield = amountXLM * apyRate * (lockPeriodDays / 365);
    const dailyYield = (amountXLM * apyRate) / 365;
    const totalReturn = amountXLM + projectedYield;
    
    // Simplistic break-even for demo (usually more complex with fees, but here we just show the lock)
    const breakEvenDays = 0; 

    return {
      projectedYield: Number(projectedYield.toFixed(4)),
      dailyYield: Number(dailyYield.toFixed(4)),
      totalReturn: Number(totalReturn.toFixed(4)),
      breakEvenDays,
    };
  }, [amountXLM, lockPeriodDays, apyRate]);
}
