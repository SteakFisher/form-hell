"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface ToolbarButtonProps {
	children: ReactNode;
	text?: string;
	onBtnClick?: () => void;
	className?: string;
}

const ToolbarButton = ({
	children,
	text,
	onBtnClick,
	className,
}: ToolbarButtonProps) => {
	return (
		<div
			className={cn("flex size-12 border border-zinc-600", className)}
			style={{ cursor: "pointer" }}
			onClick={onBtnClick}
		>
			{children}
			{text}
		</div>
	);
};

export default ToolbarButton;
