"use client";

interface CategoryRow {
  category: string;
  amount: number;
  count: number;
  color: string;
}

interface TopCategoriesProps {
  data: CategoryRow[];
  max: number;
}

function fmt(n: number) {
  return `₦${Number(n).toLocaleString()}`;
}

export default function TopCategories({ data, max }: TopCategoriesProps) {
  return (
    <div className="bg-white border border-[#f0f0ee] rounded-2xl p-5">
      <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-widest mb-4">
        Top categories
      </p>
      <div className="space-y-4">
        {data.map((row, i) => {
          const pct = max > 0 ? (row.amount / max) * 100 : 0;
          return (
            <div key={row.category}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#9ca3af] w-4">{i + 1}</span>
                  <span className="text-sm font-medium text-[#0a1a14]">
                    {row.category}
                  </span>
                  <span className="text-xs text-[#9ca3af]">
                    {row.count} txns
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#0a1a14]">
                  {fmt(row.amount)}
                </span>
              </div>
              <div className="h-1.5 bg-[#f7f6f2] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: row.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
