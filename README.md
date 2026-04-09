# 🔑 StakeVault

[![Stellar](https://img.shields.io/badge/Stellar-Black?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Soroban-Violet?style=for-the-badge&logo=rust&logoColor=white)](https://soroban.stellar.org)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)

**StakeVault** is a premium, decentralized XLM staking platform built on the **Stellar Soroban** network. It empowers users to lock their assets in secure smart contracts and earn yield automatically with a glassmorphism-inspired, high-performance UI.

---

## ✨ Visual Showcase

### 🌌 Galactic Landing Page
Experience the mission-control interface with live protocol statistics and "Electric Violet" aesthetics.
![Landing Page](./public/screenshots/landing.png)

### 📊 Staker Dashboard
Monitor your portfolio, projected yields, and upcoming unlocks with real-time on-chain simulation.
![Staker Dashboard](./public/screenshots/staker_dash.png)

### 🛡️ Admin Command Center
Fully decentralized contract management, from APY rate rotation to protocol-wide fund monitoring.
![Admin Dashboard](./public/screenshots/admin_dash.png)

---

## 🚀 Key Features

- **⚡ Soroban Smart Contracts**: Fully automated staking logic with on-chain verification.
- **📈 Dynamic Yield Curves**: Multiple lock periods (7, 30, 90 days) with tiered APY up to 12%.
- **🔐 Role-Based Access**:
  - **Stakers**: Deposit XLM, track earnings, and perform emergency withdrawals.
  - **Admins**: Manage contract state, rotate APY rates, and monitor protocol health.
- **🎨 Electric Violet Design**: Premium UI/UX featuring glassmorphism, smooth animations, and zero-green color palette.
- **💼 Wallet Integration**: Native support for **Freighter Wallet** for secure transaction signing.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion.
- **Blockchain**: Stellar SDK, Soroban-React, Freighter API.
- **Backend API**: Next.js Serverless Routes, MongoDB (Mongoose) for state persistence.
- **Auth**: Next-Auth (Role-based credential provider).
- **Styling**: Shadcn/UI for premium components.

---

## 🏗️ Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (or local MongoDB)
- [Freighter Wallet Extension](https://www.freighter.app/)

### 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pkaranbe25/stakevault.git
   cd stakevault
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/stakevault
   NEXTAUTH_SECRET=your_32_character_secret_here
   NEXTAUTH_URL=http://localhost:3000

   NEXT_PUBLIC_STELLAR_NETWORK=testnet
   NEXT_PUBLIC_STELLAR_HORIZON=https://horizon-testnet.stellar.org
   NEXT_PUBLIC_SOROBAN_RPC=https://soroban-testnet.stellar.org
   NEXT_PUBLIC_CONTRACT_ID=YOUR_SOROBAN_CONTRACT_ID
   ```

### 🏃 Running Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to launch the protocol.

---

## 📖 Proper Usage Guidelines

### 1. Connecting Your Wallet
Ensure your Freighter wallet is set to **Testnet**. StakeVault uses the Soroban RPC to simulate and submit transactions.

### 2. Initial Setup (Admin)
- Signup as an **Admin**.
- Navigate to the **Contract Management** page to initialize the protocol parameters.
- Deploy or link your Soroban Contract ID.

### 3. Staking Assets
- Deposit XLM by choosing a lock period in the **Yield Calculator**.
- Confirm transaction via Freighter.
- View your growing yield in the **Staker Dashboard**.

---

## 🛡️ Security
StakeVault implements defensive programming patterns to handle network latency and data integrity. All financial calculations are validated both on-chain and in the API layer.

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

