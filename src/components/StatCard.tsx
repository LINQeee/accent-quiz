import { Card, CardContent } from "./ui/Card";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
        {hint && <p className="mt-2 text-sm text-slate-500">{hint}</p>}
      </CardContent>
    </Card>
  );
}
