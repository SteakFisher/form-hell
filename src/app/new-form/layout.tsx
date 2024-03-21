"use client";

import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import FormItem from "@/interfaces/FormItem";
import { constants } from "@/constants";
import { useRef, useState } from "react";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [formItems, setFormItems] = useState<FormItem[]>([
		{ id: 0, props: constants.defaultTitleProps },
	]);
	let debounceRefs = new Map();
	let focusedIndexRef = useRef(0);

	return (
		<FormBuilderContext.Provider
			value={{
				formItems: formItems,
				setFormItems: setFormItems,
				debounceRefs: debounceRefs,
				focusedIndexRef: focusedIndexRef,
			}}
		>
			{children}
		</FormBuilderContext.Provider>
	);
}
