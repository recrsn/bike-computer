export type Theme = "error" | "warning" | "success" | "info";

export function borderColor(theme: Theme) {
  switch (theme) {
    case "error":
      return "border-red-500";
    case "warning":
      return "border-yellow-500";
    case "success":
      return "border-green-500";
    case "info":
      return "border-blue-500";
  }
}

export function backgroundColor(theme: Theme) {
  switch (theme) {
    case "error":
      return "bg-red-100";
    case "warning":
      return "bg-yellow-100";
    case "success":
      return "bg-green-100";
    case "info":
      return "bg-blue-100";
  }
}

export function foregroundColor(theme: Theme) {
  switch (theme) {
    case "error":
      return "text-red-500";
    case "warning":
      return "text-yellow-500";
    case "success":
      return "text-green-500";
    case "info":
      return "text-blue-500";
  }
}