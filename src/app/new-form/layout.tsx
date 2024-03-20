"use client";

import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import FormItem from "@/interfaces/FormItem";
import { constants } from "@/constants";
import { useState } from "react";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [formItems, setFormItems] = useState<FormItem[]>([
		{ id: 0, props: constants.defaultTitleProps },
	]);
	let debounceRefs = new Map();
	return (
		<FormBuilderContext.Provider
			value={{
				formItems: formItems,
				setFormItems: setFormItems,
				debounceRefs: debounceRefs,
			}}
		>
			{children}
		</FormBuilderContext.Provider>
	);
}
