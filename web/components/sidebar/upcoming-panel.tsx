interface UpcomingEvent {
  date: string;
  label: string;
  highlight?: boolean;
}

const UPCOMING: UpcomingEvent[] = [
  {
    date: "Mon May 5",
    label: "FY27 budget hearing — 9am, City Hall",
    highlight: false,
  },
  {
    date: "Wed May 6",
    label: "FY27 budget hearing (schools) — 6pm, City Hall",
    highlight: true,
  },
  {
    date: "Tues May 12",
    label: "FY27 budget hearing — 9am, City Hall",
    highlight: false,
  },
  {
    date: "Mon June 1",
    label: "FY27 budget adoption vote — City Council",
    highlight: false,
  },
  {
    date: "Nov 3, 2026",
    label: "Cambridge municipal election",
    highlight: false,
  },
];

export function UpcomingPanel() {
  return (
    <div className="rounded-card bg-card-white shadow-card-soft p-5 space-y-3">
      <h3 className="font-serif text-base text-headline-light leading-snug">
        Upcoming meetings
      </h3>
      <ul className="space-y-3">
        {UPCOMING.map(({ date, label, highlight }) => (
          <li key={date + label} className="flex gap-3">
            <div
              className="shrink-0 w-[3px] rounded-full"
              style={{
                backgroundColor: highlight ? "#294259" : "#617585",
                opacity: highlight ? 1 : 0.4,
              }}
            />
            <div className="space-y-0.5">
              <p
                className="font-sans text-[11px] font-bold uppercase tracking-wide"
                style={{ color: highlight ? "#294259" : "#617585" }}
              >
                {date}
              </p>
              <p className="font-sans text-xs leading-snug text-body-light">
                {label}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
