type FieldProps = {
  title: string;
  unit?: string;
  value: string;
  size?: "small" | "medium" | "large";
}

function valueClassNameForSize(size?: string) {
  if (!size) return "text-2xl";
  switch (size) {
    case "small":
      return "text-sm";
    case "medium":
      return "text-2xl";
    case "large":
      return "text-4xl";
  }
}

export default function Field({ title, unit, value, size }: FieldProps) {
  return (
    <div className="flex flex-col items-center py-3">
      <span className="font-bold text-gray-600 uppercase" >{title}</span>
      <div className="font-mono flex flex-row items-center">
        <span className={`${valueClassNameForSize(size)}`}>{value}</span>
        {unit && <span className="ml-1">{unit}</span>}
      </div>
    </div>);
}
