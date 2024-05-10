"use client";

import FormBuilder from "@/components/FormBuilder";
import Toolbar from "@/components/toolbar/Toolbar";
import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import FormItem from "@/interfaces/FormItem";
import { useMemo, useRef, useState } from "react";

const NewFormPage = () => {
	let debounceRefs = useMemo(() => new Map(), []);
	let focusedItemRef = useRef({ id: "0", blurItem: () => {} });
	let heightDiffRef = useRef({ heightDiff: 0, shouldScroll: false });
	const [formItems, setFormItems] = useState<FormItem[]>(
		constants.defaultFormItems,
	);

	return (
		<FormBuilderContext.Provider
			value={{
				debounceRefs,
				focusedItemRef,
				formItems,
				heightDiffRef,
				setFormItems,
			}}
		>
			<div className="flex w-full justify-center py-20">
				<FormBuilder />
			</div>
			<Toolbar />
		</FormBuilderContext.Provider>
	);
};

export default NewFormPage;
