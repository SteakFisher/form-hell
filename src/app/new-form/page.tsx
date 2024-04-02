"use client";

import { useRef, useState } from "react";
import FormBuilder from "@/components/FormBuilder";
import Toolbar from "@/components/toolbar/Toolbar";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import FormItem from "@/interfaces/FormItem";
import { constants } from "@/constants";

const NewFormPage = () => {
	let debounceRefs = new Map();
	let focusedIndexRef = useRef("0");
	const [addId, setAddId] = useState("");
	const [formItems, setFormItems] = useState<FormItem[]>([
		{ id: "0", props: constants.defaultTitleProps },
	]);

	return (
		<FormBuilderContext.Provider
			value={{
				addId: addId,
				debounceRefs: debounceRefs,
				focusedIndexRef: focusedIndexRef,
				formItems: formItems,
				setAddId: setAddId,
				setFormItems: setFormItems,
			}}
		>
			<div className="flex w-full justify-center pb-72 pt-28">
				<FormBuilder />
			</div>
			<Toolbar />
		</FormBuilderContext.Provider>
	);
};

export default NewFormPage;
