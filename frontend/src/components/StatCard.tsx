"use client";

type StatCardProps = {
  label: string;
  value: string;
  helper?: string;
};

export function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <div className="glass-panel flex flex-col gap-2 p-4">
      <p className="text-xs uppercase tracking-[0.35em] text-white/50">{label}</p>
      <p className="text-2xl font-semibold text-white break-all">{value}</p>
      {helper && <p className="text-xs text-white/60">{helper}</p>}
    </div>
  );
}
