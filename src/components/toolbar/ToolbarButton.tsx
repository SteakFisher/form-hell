import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ToolbarButtonProps {
	children: ReactNode;
	className?: string;
	onBtnClick?: () => void;
}

const ToolbarButton = ({
	children,
	className,
	onBtnClick,
}: ToolbarButtonProps) => {
	return (
		<div
			className={cn("flex size-12 border border-accent", className)}
			style={{ cursor: "pointer" }}
			tabIndex={-1}
			onClick={onBtnClick}
		>
			{children}
		</div>
	);
};

export default ToolbarButton;
