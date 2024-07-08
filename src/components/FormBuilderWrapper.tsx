"use client";

import FormBuilder from "@/components/FormBuilder";
import Toolbar from "@/components/toolbar/Toolbar";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { FBFormObject, FormItem } from "formhell-js";
import { useEffect, useMemo, useRef, useState } from "react";
import FBMenuBar from "./FBMenuBar";

type FormBuilderWrapperProps = {
	formObject: FBFormObject;
	type: "edit" | "new";
};

export default function FormBuilderWrapper({
	formObject,
	type,
}: FormBuilderWrapperProps) {
	const debounceRefs = useMemo(() => new Map(), []);
	const firstRenderRef = useRef(false);
	const focusedItemRef = useRef({ id: "0", blurItem: () => {} });
	const formBuilderRef = useRef<HTMLDivElement>(null);
	const heightDiffRef = useRef({ heightDiff: 0, shouldScroll: false });
	const isSavingRef = useRef(false);

	const [formDesc, setFormDesc] = useState(
		formObject.formTitleObj.description,
	);
	const [formItems, setFormItems] = useState<FormItem[]>(formObject.formItems);
	const [formTitle, setFormTitle] = useState(formObject.formTitleObj.title);

	useEffect(() => {
		firstRenderRef.current = false;
	}, []);

	return (
		<>
			<FormBuilderContext.Provider
				value={{
					debounceRefs,
					firstRenderRef,
					focusedItemRef,
					formBuilderRef,
					formDesc,
					formItems,
					formTitle,
					heightDiffRef,
					isSavingRef,
					setFormDesc,
					setFormItems,
					setFormTitle,
				}}
			>
				<FBMenuBar />
				<div className="flex h-min w-full justify-center pb-56 pt-20">
					<FormBuilder />
				</div>
				<Toolbar formId={formObject.formId} type={type} />
			</FormBuilderContext.Provider>
		</>
	);
}
