"use client";

import { useState } from "react";
import FormBuilder from "../components/FormBuilder";
import Toolbar from "../components/Toolbar/Toolbar";
import { FormBuilderContext } from "../contexts/FormBuilderContext";
import FormItem from "../interfaces/FormItem";

const NewFormPage = () => {
	const [formItems, setFormItems] = useState<FormItem[]>([]);
	
	return (
		<FormBuilderContext.Provider value={{formItems: formItems, setFormItems: setFormItems}}>
			<div>NewFormPage</div>
			<div className="flex w-full justify-center">
				<FormBuilder />
			</div>
			<Toolbar />
		</FormBuilderContext.Provider>
	);
};

export default NewFormPage;
                            