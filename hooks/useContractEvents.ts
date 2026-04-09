import { useState, useEffect } from 'react';
import { SorobanRpc } from '@stellar/stellar-sdk';

export function useContractEvents(contractId: string) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (!contractId) return;

    const fetchEvents = async () => {
      try {
        const rpc = new SorobanRpc.Server(process.env.NEXT_PUBLIC_SOROBAN_RPC!);
        // Simplification for hackathon: in real app, we'd use getEvents with proper startLedger
        const latestLedger = await rpc.getLatestLedger();
        const response = await rpc.getEvents({
          startLedger: latestLedger.sequence - 100, // Last 100 ledgers
          filters: [
            {
              type: 'contract',
              contractIds: [contractId],
            },
          ],
        });
        
        setEvents(response.events);
        setLastUpdated(new Date());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Soroban events:', error);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 15000); // Poll every 15s

    return () => clearInterval(interval);
  }, [contractId]);

  return { events, loading, lastUpdated };
}
