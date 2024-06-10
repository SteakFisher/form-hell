import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";

interface ToolbarButtonProps {
	children: ReactNode;
	className?: string;
	desc: string;
	onBtnClick?: () => void;
}

const ToolbarButton = ({
	children,
	className,
	desc,
	onBtnClick,
}: ToolbarButtonProps) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={200}>
				<TooltipTrigger asChild>
					<div
						className={cn("flex size-12 border border-accent", className)}
						style={{ cursor: "pointer" }}
						tabIndex={-1}
						onClick={onBtnClick}
					>
						{children}
					</div>
				</TooltipTrigger>
				<TooltipContent side="bottom">
					<p>{desc}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default ToolbarButton;
