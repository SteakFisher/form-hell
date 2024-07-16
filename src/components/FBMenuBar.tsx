import { constants } from "@/constants";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

type FBMenuBarProps = {
	fbTab: "form-builder" | "settings";
	formTitle: string;
	setFbTab: (newTab: "form-builder" | "settings") => void;
};

export default function FBMenuBar({
	fbTab,
	formTitle,
	setFbTab,
}: FBMenuBarProps) {
	const [menuBarTitle, setMenuBarTitle] = useState(formTitle);

	const updateMenuBarTitle = useDebouncedCallback(() => {
		setMenuBarTitle(formTitle);
	}, constants.debounceWait);

	useEffect(() => {
		updateMenuBarTitle();
	}, [formTitle]);

	return (
		<div className="fixed top-0 z-50 flex h-16 w-full flex-col items-center justify-end bg-zinc-800 shadow-sm shadow-black">
			<div className="flex h-7 w-full items-center justify-center text-xl font-bold">
				{menuBarTitle || "Untitled Form"}
			</div>
			<Tabs
				defaultValue="form-builder"
				className="h-min"
				value={fbTab}
				onValueChange={(newTab) => handleTabChange(newTab)}
			>
				<TabsList className="h-9 rounded-none">
					<TabsTrigger value="form-builder">Form Builder</TabsTrigger>
					<TabsTrigger value="settings">Settings</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
	);

	function handleTabChange(newTab: string) {
		if (newTab !== "form-builder" && newTab !== "settings") return;
		setFbTab(newTab);
	}
}
