import { useState, useMemo } from "react";


type Status   = "Pending" | "Routed" | "Resolved";
type SeverityLevel = 'low' | 'medium' | 'high' | 'critical'

interface Report {
  ref:          string;
  cat:          string;
  state:        string;
  lga:          string;
  address:      string;
  sev:          SeverityLevel;
  outpost:      string;
  outpostDist:  string;
  time:         string;
  desc:         string;
  status:       Status;
}

const INITIAL_REPORTS: Report[] = [
  { ref: "CS-2025-11204", cat: "Armed robbery",       state: "Kano",   lga: "Tarauni",    address: "Naibawa",            sev: "critical", outpost: "Tarauni Police Station",   outpostDist: "1.2km", time: "2025-07-12 08:41", desc: "Two armed men on motorcycle snatched a phone near Naibawa junction, heading north on a black Bajaj.",       status: "Pending"  },
  { ref: "CS-2025-22897", cat: "Suspicious activity", state: "Abuja",  lga: "Wuse",       address: "Wuse Zone 4",        sev: "medium",   outpost: "Wuse II Police Station",   outpostDist: "0.8km", time: "2025-07-12 09:14", desc: "Unidentified male loitering around embassy row for over 2 hours, taking photos of vehicles.",              status: "Routed"   },
  { ref: "CS-2025-33410", cat: "Civil unrest",        state: "Lagos",  lga: "Oshodi",     address: "Oshodi Underbridge", sev: "high",     outpost: "Oshodi Police Division",   outpostDist: "0.5km", time: "2025-07-12 10:02", desc: "Crowd of roughly 80 persons blocking the expressway. Altercation between transport union members.",         status: "Routed"   },
  { ref: "CS-2025-44021", cat: "Missing person",      state: "Kaduna", lga: "Chikun",     address: "Kujama Village",     sev: "high",     outpost: "Chikun Divisional HQ",     outpostDist: "3.1km", time: "2025-07-11 22:30", desc: "12-year-old boy last seen heading to the stream at dusk, wearing blue shorts and white t-shirt.",             status: "Pending"  },
  { ref: "CS-2025-55873", cat: "Infrastructure",      state: "Rivers", lga: "Obio-Akpor", address: "Rumuola Road",       sev: "low",      outpost: "Obio-Akpor Area Command",  outpostDist: "2.0km", time: "2025-07-11 15:55", desc: "Exposed high-tension wire dangling over the road after last night's storm, risk of electrocution.",           status: "Resolved" },
  { ref: "CS-2025-66341", cat: "Pre-emptive intel",   state: "Borno",  lga: "Jere",       address: "Maiduguri Outskirts",sev: "critical", outpost: "Jere Military Base",       outpostDist: "5.4km", time: "2025-07-11 06:10", desc: "Community informant reports unusual movement of 15–20 individuals with bags heading toward the bush path.",   status: "Pending"  },
  { ref: "CS-2025-77209", cat: "Armed robbery",       state: "Ogun",   lga: "Sagamu",     address: "Sagamu Interchange", sev: "high",     outpost: "Sagamu Divisional HQ",     outpostDist: "1.7km", time: "2025-07-10 23:48", desc: "Three vehicles stopped at makeshift roadblock. Occupants robbed at gunpoint. Attackers fled toward Ore road.", status: "Resolved" },
  { ref: "CS-2025-88014", cat: "Suspicious activity", state: "Kano",   lga: "Nassarawa",  address: "Fagge Market",       sev: "medium",   outpost: "Nassarawa Police Station", outpostDist: "0.9km", time: "2025-07-10 14:30", desc: "Abandoned bag spotted at the market entrance. Vendor reports it has been there since morning.",               status: "Resolved" },
  { ref: "CS-2025-99765", cat: "Civil unrest",        state: "Abuja",  lga: "Garki",      address: "Area 11 Roundabout", sev: "medium",   outpost: "Garki Area Command",       outpostDist: "1.1km", time: "2025-07-10 11:20", desc: "Student protest march of approx 200 people moving from University of Abuja junction toward NASS.",             status: "Routed"   },
  { ref: "CS-2025-10432", cat: "Missing person",      state: "Lagos",  lga: "Alimosho",   address: "Ikotun",             sev: "high",     outpost: "Alimosho Police Division", outpostDist: "2.3km", time: "2025-07-09 19:05", desc: "Woman, 34, missing since yesterday. Last seen at Ikotun market in yellow blouse. Family unable to reach her.", status: "Pending"  },
];


const SEV_CLASSES: Record<SeverityLevel, string> = {
  low:      "bg-black/10 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400",
  medium:   "bg-black/10 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400",
  high:     "bg-black/10 dark:bg-red-500/10 text-red-500 dark:text-red-400",
  critical: "bg-black/10 dark:bg-red-500 text-red-700 dark:text-white",
};

const STATUS_CLASSES: Record<Status, string> = {
  Pending:  "dark:text-white/45 bg-black/10 text-black/50 dark:bg-white/8",
  Routed:   "dark:text-blue-400 bg-black/10 text-blue-700 ",
  Resolved: "dark:text-teal-400 bg-black/10 text-teal-700 ",
};

const MetricCard = ({
  label, value, valueClass = "",
}: { label: string; value: number; valueClass?: string }) => (
  <div className="border border-black/10 bg-black/5 dark:bg-white/5 rounded-lg px-4 py-3 text-center">
    <p className="text-[11px] text-black/45 dark:text-white/40 mb-1">{label}</p>
    <p className={`text-[22px] font-bold tracking-[-0.03em] ${valueClass}`}>{value}</p>
  </div>
);

const Badge = ({ label, cls }: { label: string; cls: string }) => (
  <span className={`inline-flex items-center px-2 py-0.5 dark:border-none border rounded-full text-[11px] font-bold whitespace-nowrap ${cls}`}>
    {label}
  </span>
);


export default function CommandCenter() {
  const [reports, setReports]   = useState<Report[]>(INITIAL_REPORTS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch]     = useState("");
  const [sevFilter, setSevFilter]       = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [stateFilter, setStateFilter]   = useState("");

  const states = useMemo(
    () => [...new Set(INITIAL_REPORTS.map((r) => r.state))].sort(),
    []
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return reports.filter((r) => {
      const matchQ = !q || [r.ref, r.cat, r.address, r.lga, r.state, r.outpost]
        .join(" ").toLowerCase().includes(q);
      return (
        matchQ &&
        (!sevFilter    || r.sev    === sevFilter) &&
        (!statusFilter || r.status === statusFilter) &&
        (!stateFilter  || r.state  === stateFilter)
      );
    });
  }, [reports, search, sevFilter, statusFilter, stateFilter]);

  const metrics = useMemo(() => ({
    total:    filtered.length,
    critical: filtered.filter((r) => r.sev === "critical").length,
    pending:  filtered.filter((r) => r.status === "Pending").length,
    resolved: filtered.filter((r) => r.status === "Resolved").length,
  }), [filtered]);

  const updateStatus = (ref: string, status: Status) =>
    setReports((prev) => prev.map((r) => r.ref === ref ? { ...r, status } : r));

  const toggleExpand = (ref: string) =>
    setExpanded((prev) => (prev === ref ? null : ref));

  const selectCls =
    "text-[13px] h-[34px] px-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-[#1a1a18] dark:text-[#f5f4ef] outline-none focus:border-black/25 transition-colors cursor-pointer";

  return (
    <div className="font-syne dark:text-[#f5f4ef] min-h-screen">
      <div className="max-w-5xl mx-auto px-5 py-16">

        {/* Header */}
        <div className="mb-6">
          <p className="font-mono text-[9px] tracking-[0.12em] text-black/40 dark:text-white/30 uppercase mb-2">
            Command center
          </p>
          <h1 className="text-[1.6rem] font-extrabold tracking-[-0.04em] leading-[1.1]">
            Incident reports
          </h1>
          <p className="text-[13px] dark:text-white/45 mt-1">
            All incoming reports · route to nearest outpost
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <MetricCard label="Total reports" value={metrics.total} />
          <MetricCard label="Critical"  value={metrics.critical} valueClass="text-red-500" />
          <MetricCard label="Pending"   value={metrics.pending}  valueClass="text-amber-500" />
          <MetricCard label="Resolved"  value={metrics.resolved} valueClass="text-teal-500" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Search ref, location, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${selectCls} flex-1 min-w-45`}
          />
          <select className={selectCls} value={sevFilter} onChange={(e) => setSevFilter(e.target.value)}>
            <option value="">All severities</option>
            {(["low", "medium", "high", "critical"] as SeverityLevel[]).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select className={selectCls} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {(["Pending", "Routed", "Resolved"] as Status[]).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select className={selectCls} value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
            <option value="">All states</option>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="border border-white/8 rounded-xl overflow-hidden">
          <table className="w-full border-collapse text-[13px]" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col className="hidden md:table-cell md:w-[11%]" />
              <col className="w-[18%] md:w-[17%]" />
              <col className="w-[22%] md:w-[14%]" />
              <col className="w-[15%] md:w-[10%]" />
              <col className="w-[30%] md:w-[20%]" />
              <col className="hidden md:table-cell md:w-[10%]" />
              <col className="w-[15%] md:w-[18%]" />
            </colgroup>
            <thead>
              <tr className="bg-black/5 dark:bg-white/4 border-b border-white/8">
                {["Ref", "Category", "Location", "Severity", "Nearest outpost", "Status", "Actions"].map((h) => (
                  <th key={h} className={`px-4 py-3 text-left font-mono text-[10px] tracking-widest uppercase text-black/40 dark:text-white/30 ${(h === "Ref" || h === "Status") ? "hidden md:table-cell" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-[13px] dark:text-white/30">
                    No reports match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <>
                    <tr
                      key={r.ref}
                      onClick={() => toggleExpand(r.ref)}
                      className="border-b border-white/6 hover:bg-black/5 dark:hover:bg-white/3 cursor-pointer transition-colors"
                    >
                      {/* Ref */}
                      <td className="hidden md:table-cell px-4 py-3 font-mono text-[11px] text-black/40 dark:text-white/35 overflow-hidden text-ellipsis whitespace-nowrap">
                        {r.ref}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                        {r.cat}
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3 overflow-hidden">
                        <div className="text-[12px] font-bold truncate">{r.lga}, {r.state}</div>
                        <div className="text-[11px] dark:text-white/35 truncate">{r.address}</div>
                      </td>

                      {/* Severity */}
                      <td className="px-4 py-3">
                        <Badge label={r.sev} cls={SEV_CLASSES[r.sev]} />
                      </td>

                      {/* Outpost */}
                      <td className="px-4 py-3 overflow-hidden">
                        <div className="text-[12px] font-bold truncate">{r.outpost}</div>
                        <div className="text-[11px] dark:text-white/35">{r.outpostDist} away</div>
                      </td>

                      {/* Status */}
                      <td className="hidden md:table-cell px-4 py-3">
                        <Badge label={r.status} cls={STATUS_CLASSES[r.status]} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1.5">
                          {r.status === "Pending" && (
                            <button
                              onClick={() => updateStatus(r.ref, "Routed")}
                              className="text-[11px] px-2.5 py-1 rounded-lg border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
                            >
                              Route
                            </button>
                          )}
                          {r.status !== "Resolved" && (
                            <button
                              onClick={() => updateStatus(r.ref, "Resolved")}
                              className="text-[11px] px-2.5 py-1 rounded-lg border border-teal-500/30 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 transition-colors cursor-pointer"
                            >
                              Resolve
                            </button>
                          )}
                          {r.status === "Resolved" && (
                            <span className="text-[11px] text-teal-500">Done</span>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {expanded === r.ref && (
                      <tr key={`${r.ref}-detail`} className="border-b border-white/6">
                        <td
                          colSpan={7}
                          className="px-4 py-4 text-[13px] dark:text-white/50 bg-black/5 dark:bg-white/2 leading-[1.7] whitespace-normal"
                        >
                          <span className="font-bold dark:text-white/80">Incident detail: </span>
                          {r.desc}
                          <span className="block mt-2 font-mono text-[11px] dark:text-white/25">
                            Reported at {r.time}
                          </span>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}