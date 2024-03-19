"use client";

import { useState } from "react";
import FormBuilder from "@/components/FormBuilder";
import Toolbar from "@/components/toolbar/Toolbar";
import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import FormItem from "@/interfaces/FormItem";

const NewFormPage = () => {
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
			<div className="flex w-full justify-center py-7">
				<FormBuilder />
			</div>
			<Toolbar />
		</FormBuilderContext.Provider>
	);
};

export default NewFormPage;
