"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface ToolbarButtonProps {
	children: ReactNode;
	onBtnClick?: () => void;
	className?: string;
}

const ToolbarButton = ({
	children,
	onBtnClick,
	className,
}: ToolbarButtonProps) => {
	return (
		<div
			className={cn("flex size-12 border border-accent", className)}
			style={{ cursor: "pointer" }}
			onClick={onBtnClick}
		>
			{children}
		</div>
	);
};

export default ToolbarButton;
