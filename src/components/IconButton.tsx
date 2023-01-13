import { foregroundColor, Theme } from "./theme";
import { HTMLProps } from "react";

type IconButtonProps = { theme: Theme } & HTMLProps<HTMLButtonElement>;
export default function IconButton({
                                     theme,
                                     type,
                                     className,
                                     disabled,
                                     children,
                                     ...props
                                   }: IconButtonProps) {
  const clazz = `${disabled ? "text-gray-500" : foregroundColor(theme)} ${className}`;
  return (
    // @ts-ignore
    <button type={type} disabled={disabled} className={clazz} {...props}>
      {children}
    </button>
  );
}