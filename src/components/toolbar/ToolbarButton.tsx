import { cn } from "@/lib/utils";
import { ReactNode, useRef, useState } from "react";
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
	const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const [tooltipOpen, setTooltipOpen] = useState(false);

	return (
		<TooltipProvider>
			<Tooltip delayDuration={200} open={tooltipOpen}>
				<TooltipTrigger
					onMouseEnter={() => {
						openTimeoutRef.current = setTimeout(() => {
							setTooltipOpen(true);
						}, 500);
					}}
					onMouseLeave={() => {
						if (!openTimeoutRef.current) return;
						clearTimeout(openTimeoutRef.current);
						setTooltipOpen(false);
					}}
					onPointerDown={(e) => e.preventDefault()}
					asChild
				>
					<div
						className={cn("flex size-12 border border-accent", className)}
						style={{ cursor: "pointer" }}
						tabIndex={-1}
						onClick={onBtnClick}
					>
						{children}
					</div>
				</TooltipTrigger>
				<TooltipContent
					onPointerDownOutside={(e) => e.preventDefault()}
					side="bottom"
				>
					<p>{desc}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default ToolbarButton;
