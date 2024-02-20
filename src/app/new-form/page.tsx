"use client";

import { ChangeEvent, useState } from "react";
import FormBuilder from "../components/FormBuilder";
import Toolbar from "../components/toolbar/Toolbar";
import { FormBuilderContext } from "../contexts/FormBuilderContext";
import FormItem from "../interfaces/FormItem";
import { constants } from "../constants";
import { DebouncedState } from "use-debounce";

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
			<div>NewFormPage</div>
			<div className="flex w-full justify-center">
				<FormBuilder />
			</div>
			<Toolbar />
		</FormBuilderContext.Provider>
	);
};

export default NewFormPage;
