import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { useContext, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export default function FBMenuBar() {
	const { formTitle } = useContext(FormBuilderContext);

	const [tab, setTab] = useState("form-builder");

	return (
		<div className="flex h-16 w-full flex-col items-center justify-end bg-zinc-800">
			<div className="flex h-7 w-full items-center justify-center text-xl font-bold">
				{formTitle}
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
