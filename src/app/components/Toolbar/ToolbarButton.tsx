"use client";

import React, { ReactNode } from "react";

interface ToolbarButtonProps {
	children: ReactNode
	text?: string
	onBtnClick: () => void
}

const ToolbarButton = ({ children, text, onBtnClick }: ToolbarButtonProps) => {
  return (
    <div className="flex size-12 border border-zinc-600" style={{ cursor: 'pointer' }} onClick={onBtnClick}>
      {children}
      {text}
    </div>
  );
};

export default ToolbarButton;
