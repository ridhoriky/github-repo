import { type ReactNode } from "react";

interface ListItemCardProps {
  title: string;
  onClick?: (name: string) => void;
  rightIcon?: React.ReactNode;
  className?: string;
  children?: ReactNode;
}

const ListItemCard = ({
  title,
  onClick,
  rightIcon,
  className,
  children,
}: ListItemCardProps) => {
  return (
    <div>
      <div
        onClick={() => {
          if (onClick) onClick(title);
        }}
        className={` p-2 rounded-md flex items-center justify-between mt-2 cursor-pointer ${className}`}
      >
        <p>{`${title.substring(0, 30)}${title.length > 30 ? "..." : ""}`}</p>
        {rightIcon}
      </div>
      {children}
    </div>
  );
};

export default ListItemCard;
