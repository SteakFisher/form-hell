import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { useContext, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export default function FBMenuBar() {
	const { formTitle } = useContext(FormBuilderContext);

	const [menuBarTitle, setMenuBarTitle] = useState(formTitle);
	const [tab, setTab] = useState("form-builder");

	const updateMenuBarTitle = useDebouncedCallback(() => {
		setMenuBarTitle(formTitle);
	}, constants.debounceWait);

	useEffect(() => {
		updateMenuBarTitle();
	}, [formTitle]);

	return (
		<div className="fixed top-0 z-50 flex h-16 w-full flex-col items-center justify-end bg-zinc-800 shadow-sm shadow-black">
			<div className="flex h-7 w-full items-center justify-center text-xl font-bold">
				{menuBarTitle}
			</div>
			<Tabs
				defaultValue="form-builder"
				className="h-min"
				value={tab}
				onValueChange={setTab}
			>
				<TabsList className="h-9 rounded-none">
					<TabsTrigger value="form-builder">Form Builder</TabsTrigger>
					<TabsTrigger value="settings">Settings</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
	);
}
