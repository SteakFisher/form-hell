"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FormItem from "@/interfaces/FormItem";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import FormBuilder from "@/components/FormBuilder";
import Toolbar from "@/components/toolbar/Toolbar";
import FormItemsObject from "@/interfaces/FormItemsObject";
import { v4 as uuid } from "uuid";


export default function FormBuilderWrapper({ formItemsObject } : { formItemsObject: FormItemsObject }) {
	const debounceRefs = useMemo(() => new Map(), []);
	const firstRenderRef = useRef(false);
	const focusedItemRef = useRef({ id: "0", blurItem: () => {} });
	const formBuilderRef = useRef<HTMLDivElement>(null);
	const heightDiffRef = useRef({ heightDiff: 0, shouldScroll: false });
	const isSavingRef = useRef(false);
	const keyPrefixRef = useRef(uuid());

	const [formItems, setFormItems] = useState<FormItem[]>(formItemsObject.formItems);

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
			<Toolbar />
		</FormBuilderContext.Provider>
	);
}