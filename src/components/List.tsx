import { ReactNode } from "react";
import { CaretRightIcon } from "@radix-ui/react-icons";

type ListItemProps = {
  title?: string;
  children: ReactNode;
  onClick?: () => void;
};

export function ListItemText({ children }: { children: ReactNode }) {
  return <div className="flex-grow text-gray-500">{children}</div>;
}

export function ListItem({ title, children, onClick }: ListItemProps) {
  return (
    <div
      className="flex flex-row justify-between items-center py-2"
      onClick={onClick}
    >
      <div className="flex flex-col">
        {title && <span className="font-bold">{title}</span>}
        <span>{children}</span>
      </div>
      <CaretRightIcon width={24} height={24} />
    </div>
  );
}

type ListProps = {
  children: ReactNode;
};

export function List({ children }: ListProps) {
  return <div className="flex flex-col p-2 space-y-2">{children}</div>;
}
