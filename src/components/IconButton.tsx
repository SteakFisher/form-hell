import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type IconButtonProps = {
	className?: string;
	children: React.ReactNode;
	desc: string;
	tooltipDelay?: number;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({
	className,
	children,
	desc,
	tooltipDelay,
	...props
}: IconButtonProps) {
	const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [tooltipOpen, setTooltipOpen] = useState(false);

	return (
		<Popover open={tooltipOpen} onOpenChange={setTooltipOpen}>
			<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
				<PopoverTrigger asChild onClick={(e) => e.preventDefault()}>
					<Button
						className={className}
						size="icon"
						variant="ghost"
						{...props}
					>
						{children}
					</Button>
				</PopoverTrigger>
			</div>
			<PopoverContent
				className="size-fit border border-black bg-accent px-2 py-1 text-sm text-white"
				side="bottom"
				sideOffset={6}
			>
				{desc}
			</PopoverContent>
		</Popover>
	);

	function handleMouseEnter() {
		openTimeoutRef.current = setTimeout(() => {
			setTooltipOpen(true);
		}, tooltipDelay || 500);
	}

	function handleMouseLeave() {
		if (!openTimeoutRef.current) return;
		clearTimeout(openTimeoutRef.current);
		setTooltipOpen(false);
	}
}
