import React, { useMemo } from "react";

export default function TraitsPanel({ activeTraits = {}, placed = {} }) {
  /* Default trait breakpoints (fallback jika DB trait belum digunakan) */
  const TRAIT_BREAKPOINTS = {
    Protector: [2, 4, 6],
    Sorcerer: [2, 4, 6],
    "Star Guardian": [3, 5, 7, 9],
    "The Crew": [1, 2, 3, 4, 5],
    Bastion: [2, 4, 6],
    Duelist: [2, 4, 6],
    Wraith: [2, 4, 6],
    KDA: [2, 4, 6],
  };

  /* Auto-load icons from /public/traits */
  const icons = import.meta.glob("/public/traits/*.png", {
    eager: true,
    import: "default",
  });

  /* Format trait data */
  const traits = useMemo(() => {
    return Object.entries(activeTraits)
      .map(([name, count]) => {
        const breakpoints = TRAIT_BREAKPOINTS[name] || [2, 4, 6];

        const activeBP = breakpoints.filter((bp) => count >= bp).pop() || 0;

        const iconMatch = Object.keys(icons).find((p) =>
          p.toLowerCase().includes(name.toLowerCase().replace(/\s+/g, ""))
        );

        return {
          name,
          count,
          activeBP,
          breakpoints,
          icon: iconMatch ? icons[iconMatch] : "/traits/default.png",
        };
      })
      .sort((a, b) => b.activeBP - a.activeBP || b.count - a.count);
  }, [activeTraits]);

  const totalUnits = Object.keys(placed).length;

  const totalCost = Object.values(placed).reduce(
    (sum, c) => sum + (c.cost || 1),
    0
  );

  const highlightColor = (activeBP) => {
    if (activeBP >= 7) return "border-purple-400";
    if (activeBP >= 5) return "border-yellow-400";
    if (activeBP >= 3) return "border-green-400";
    if (activeBP >= 1) return "border-blue-400";
    return "border-white/10";
  };

  return (
    <div
      className="bg-[#141824]/60 rounded-2xl border border-white/5 p-4 flex flex-col"
      style={{ maxHeight: "400px" }}
    >
      <h2 className="text-lg font-bold mb-4 px-1">Traits</h2>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {traits.map((tr, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 bg-[#1A1D2C] border ${highlightColor(
              tr.activeBP
            )} rounded-xl p-3`}
          >
            <img
              src={tr.icon}
              alt={tr.name}
              className="w-12 h-12 rounded-md object-contain"
            />

            <div className="flex-1">
              <div className="font-bold text-sm flex items-center gap-2">
                <span className="text-yellow-400 text-base">{tr.activeBP}</span>
                {tr.name}
              </div>

              <div className="text-xs text-gray-400 flex gap-1 mt-1">
                {tr.breakpoints.map((bp, idx) => (
                  <React.Fragment key={`bp-${tr.name}-${bp}`}>
                    <span
                      className={
                        tr.count >= bp
                          ? "text-yellow-400 font-bold"
                          : "text-gray-600"
                      }
                    >
                      {bp}
                    </span>
                    {idx < tr.breakpoints.length - 1 && (
                      <span className="text-gray-600">›</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}

        {traits.length === 0 && (
          <div className="text-gray-500 text-sm">No active traits</div>
        )}
      </div>

      <div className="mt-4 bg-[#0F121C] p-3 rounded-xl border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-lg">👤</span>
          <span className="font-bold">{totalUnits}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-yellow-500 text-lg">🪙</span>
          <span className="font-bold">{totalCost}</span>
        </div>
      </div>
    </div>
  );
}
