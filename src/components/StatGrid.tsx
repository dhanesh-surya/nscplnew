import type { Stat } from "@/data/types";

export default function StatGrid({ items }: { items: Stat[] }) {
  return (
    <div className="stats">
      {items.map((s) => (
        <div className="stat" key={s.label}>
          <div className="value">{s.value}</div>
          <div className="label">{s.label}</div>
          {s.hint && <div className="hint">{s.hint}</div>}
        </div>
      ))}
    </div>
  );
}
