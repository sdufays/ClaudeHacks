const COUNCILORS = [
  { name: "Sumbul Siddiqui", role: "Mayor (ex officio)" },
  { name: "Marc McGovern", role: "Vice Mayor" },
  { name: "Ayesha Wilson", role: "Councillor" },
  { name: "Burhan Azeem", role: "Councillor" },
  { name: "Patricia Nolan", role: "Councillor" },
  { name: "Paul Toner", role: "Councillor" },
  { name: "Jivan Sobrinho-Wheeler", role: "Councillor" },
  { name: "Quinton Zondervan", role: "Councillor" },
  { name: "Nicola Williams", role: "Councillor" },
];

export function CouncilorsPanel() {
  return (
    <div className="rounded-card bg-card-white shadow-card-soft p-5 space-y-3">
      <h3 className="font-serif text-base text-headline-light leading-snug">
        Your 9 councillors
      </h3>
      <p className="font-sans text-[11px] text-muted-light leading-relaxed">
        Cambridge has no districts — all 9 represent you. Voting records by issue are wired by the agents tree.
      </p>
      <ul className="space-y-2">
        {COUNCILORS.map(({ name, role }) => (
          <li key={name} className="flex items-baseline justify-between gap-2">
            <span className="font-sans text-xs font-bold text-body-light">{name}</span>
            <span className="font-sans text-[11px] text-muted-light shrink-0">{role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
