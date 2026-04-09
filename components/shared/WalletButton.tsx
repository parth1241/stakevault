'use client';

import { useState, useEffect } from "react";
import { isConnected, getAddress } from "@stellar/freighter-api";
import { Wallet, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletButtonProps {
  onConnect?: (address: string) => void;
  className?: string;
}

// Utility to merge Tailwind classes
function cn_util(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export default function WalletButton({ onConnect, className }: WalletButtonProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasFreighter, setHasFreighter] = useState(false);

  useEffect(() => {
    const checkFreighter = async () => {
      const res = await isConnected();
      setHasFreighter(res.isConnected);
    };
    checkFreighter();
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    try {
      const { address: publicKey } = await getAddress();
      setAddress(publicKey);
      if (onConnect) onConnect(publicKey);
    } catch (e) {
      console.error("Connection failed", e);
    } finally {
      setLoading(false);
    }
  };

  if (!hasFreighter) {
    return (
      <a 
        href="https://www.freighter.app/" 
        target="_blank" 
        className={cn_util("btn-secondary flex items-center gap-2 text-rose-400 border-rose-400/30", className)}
      >
        <ExternalLink size={18} />
        Install Freighter
      </a>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={loading}
      className={cn_util(
        "flex items-center gap-2 font-mono transition-all duration-300",
        address ? "btn-secondary text-primary" : "btn-primary",
        className
      )}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : address ? (
        <Check size={18} />
      ) : (
        <Wallet size={18} />
      )}
      {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "Connect Wallet"}
    </button>
  );
}
