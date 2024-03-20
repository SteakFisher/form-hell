"use client";

import { useState } from "react";
import FormBuilder from "@/components/FormBuilder";
import Toolbar from "@/components/toolbar/Toolbar";
import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import FormItem from "@/interfaces/FormItem";

const NewFormPage = () => {
	return (
		<>
			<div className="flex w-full justify-center">
				<FormBuilder />
			</div>
			<Toolbar />
		</>
	);
};

export default NewFormPage;
