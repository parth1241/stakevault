export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spinRing" />
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-12 h-12 bg-primary/10 rounded-xl animate-pulse" />
        </div>
      </div>
      <h2 className="mt-8 text-2xl font-bold gradient-text animate-pulse">StakeVault</h2>
      <div className="mt-4 flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-accent-fuchsia animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-accent-indigo animate-bounce" />
      </div>
      <p className="mt-6 text-text-muted text-sm font-medium tracking-widest uppercase">Connecting to Soroban...</p>
    </main>
  );
}
