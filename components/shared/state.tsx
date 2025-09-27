import { ReactNode } from "react";

interface StateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function State({ icon, title, description, action }: StateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
        {icon}
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
