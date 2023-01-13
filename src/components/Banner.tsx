import { backgroundColor, borderColor, Theme } from "./theme";

export function Banner({ theme, children }: { theme: Theme, children: React.ReactNode }) {
  return (
    <div className={`border rounded ${borderColor(theme)} ${backgroundColor(theme)} p-2`}>
      {children}
    </div>
  );
}

export function BannerTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-bold">{children}</div>
  );
}