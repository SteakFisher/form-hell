"use client";

import { useMemo, useRef, useState } from "react";
import FormBuilder from "@/components/FormBuilder";
import Toolbar from "@/components/toolbar/Toolbar";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import FormItem from "@/interfaces/FormItem";
import { constants } from "@/constants";

const NewFormPage = () => {
	let debounceRefs = useMemo(() => new Map(), []);
	let focusedIdRef = useRef("0");
	const [formItems, setFormItems] = useState<FormItem[]>([
		{ id: "0", props: constants.defaultTitleProps },
	]);

	return (
		<FormBuilderContext.Provider
			value={{
				debounceRefs: debounceRefs,
				focusedIdRef: focusedIdRef,
				formItems: formItems,
				setFormItems: setFormItems,
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
