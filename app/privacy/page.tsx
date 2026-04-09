'use client';

import { Shield, Lock, Eye, FileText, Scale } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="pt-20 pb-32 space-y-20">
      <section className="max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 text-primary font-bold text-xs uppercase tracking-widest">
           Legal Center
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-text-primary mb-8 tracking-tighter">
          Privacy <span className="gradient-text">Policy</span>
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          At StakeVault, privacy is not a feature; it is the default. 
          As a decentralized protocol, we collect as little data as possible.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6">
        <div className="card-surface p-12 space-y-12 leading-relaxed">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-primary">
              <Eye className="text-primary" /> 1. Data Collection
            </h2>
            <p className="text-text-secondary italic">
              Effective Date: October 24, 2024
            </p>
            <p className="text-text-secondary">
              StakeVault is designed to be a non-custodial and privacy-preserving protocol. We do not require your real name, physical address, or phone number to access the core staking functionality. 
            </p>
            <ul className="list-disc pl-6 space-y-3 text-text-secondary">
              <li><strong>Wallet Addresses:</strong> We interact with public Stellar wallet addresses to execute transactions via Soroban smart contracts.</li>
              <li><strong>Usage Data:</strong> We may collect anonymized telemetry data to improve the interface performance and security.</li>
              <li><strong>Account Information:</strong> If you choose to create an email-based account for advanced dashboard features, we store your email using industry-standard encryption.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-primary">
              <Lock className="text-accent-indigo" /> 2. Self-Custody and Security
            </h2>
            <p className="text-text-secondary">
              Since StakeVault is a non-custodial protocol, we never have access to your private keys or seed phrases. Your "privacy" is physically protected by the decentralized nature of the Stellar blockchain. 
            </p>
            <p className="text-text-secondary">
               All smart contract interactions are transparent and can be audited by anyone on the network.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-primary">
              <Scale className="text-accent-fuchsia" /> 3. Third-Party Services
            </h2>
            <p className="text-text-secondary">
              Our interface may interact with third-party providers such as:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-text-secondary">
              <li><strong>Stellar Horizon/RPC:</strong> Required to broadcast transactions and fetch on-chain state.</li>
              <li><strong>Freighter Wallet:</strong> For secure transaction signing.</li>
              <li><strong>MongoDB:</strong> For storing transient protocol metadata and user preferences.</li>
            </ul>
          </div>

          <div className="pt-10 border-t border-border-subtle text-center">
            <p className="text-text-muted text-sm">
              Questions about our privacy practices? Contact us at <span className="text-primary">privacy@stakevault.stellar</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
