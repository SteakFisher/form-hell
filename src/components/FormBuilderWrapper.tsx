"use client";

import FormBuilder from "@/components/FormBuilder";
import Toolbar from "@/components/toolbar/Toolbar";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { SettingsObject } from "@/types/Settings";
import { FBFormObject, FormItem } from "formhell-js";
import { useEffect, useMemo, useRef, useState } from "react";
import FBMenuBar from "./FBMenuBar";
import FBSettings from "./settings/FBSettings";

type FormBuilderWrapperProps = {
	formObject: FBFormObject;
	type: "edit" | "new";
};

export default function FormBuilderWrapper({
	formObject,
	type,
}: FormBuilderWrapperProps) {
	const debounceRefs = useMemo(() => new Map(), []);
	const [fbTab, setFbTab] = useState<"form-builder" | "settings">(
		"form-builder",
	);
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

	const settingsObj: SettingsObject = {
		formAccess: new Map([["asdfasdfasdf@gmail.com", "owner"]]),
	};

	return (
		<>
			<FBMenuBar fbTab={fbTab} formTitle={formTitle} setFbTab={setFbTab} />
			{/* leave space for the menu bar */}
			<div className="h-16" />
			{fbTab === "form-builder" ? (
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
						setFbTab,
						setFormDesc,
						setFormItems,
						setFormTitle,
					}}
				>
					<FormBuilder />
					<Toolbar formId={formObject.formId} type={type} />
				</FormBuilderContext.Provider>
			) : (
				<FBSettings settingsObj={settingsObj} />
			)}
		</>
	);
}
