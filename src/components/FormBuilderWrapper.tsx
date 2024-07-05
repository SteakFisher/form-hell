"use client";

import FormBuilder from "@/components/FormBuilder";
import Toolbar from "@/components/toolbar/Toolbar";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { FormItem } from "formhell-js";
import { FormItemsObject } from "formhell-js";
import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

type FormBuilderWrapperProps = {
	formObject: FormItemsObject;
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
	const keyPrefixRef = useRef(uuid());

	const [formItems, setFormItems] = useState<FormItem[]>(formObject.formItems);

	useEffect(() => {
		firstRenderRef.current = false;
	}, []);

	return (
		<FormBuilderContext.Provider
			value={{
				debounceRefs,
				firstRenderRef,
				focusedItemRef,
				formBuilderRef,
				formItems,
				heightDiffRef,
				isSavingRef,
				keyPrefixRef,
				setFormItems,
			}}
		>
			<div className="flex w-full justify-center pb-56 pt-20">
				<FormBuilder />
			</div>
			<Toolbar formId={formObject.formId} type={type} />
		</FormBuilderContext.Provider>
	);
}
