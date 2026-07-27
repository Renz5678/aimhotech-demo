import { format } from "date-fns";

interface HeaderProps {
  title: string;
  facilityName?: string;
  stationCount?: number;
}

export function Header({ title, facilityName, stationCount }: HeaderProps) {
  // Use a hardcoded date for the demo/spec, or use real current date
  const currentDate = "Sat, Jul 26 2026 • 09:41 PHT";

  return (
    <header className="flex justify-between items-center w-full px-8 py-8 bg-background">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-semibold text-primary tracking-tight">
          {title}
        </h2>
        {facilityName && (
          <span className="flex items-center gap-2 bg-muted border border-border rounded-full px-4 py-1 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            {facilityName} • {stationCount} stations
          </span>
        )}
      </div>
      <div className="text-xs font-medium tracking-wide text-muted-foreground tabular-nums">
        {currentDate}
      </div>
    </header>
  );
}
