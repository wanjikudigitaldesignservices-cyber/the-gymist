interface RepCounterProps {
  index: string;
  label: string;
  className?: string;
}

export function RepCounter({ index, label, className = "" }: RepCounterProps) {
  return (
    <div className={`rep-counter mb-4 ${className}`}>
      {index} / {label}
    </div>
  );
}
