"use client";

import { constants } from "@/app/constants";
import { FormBuilderContext } from "@/app/contexts/FormBuilderContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import ToolbarButton from "./ToolbarButton";
import { useToast } from "@/components/ui/use-toast";

const Toolbar = () => {
	const { formItems, setFormItems, debounceRefs } =
		useContext(FormBuilderContext);
	const [nextId, setNextId] = useState(formItems.length);
	const router = useRouter();
	const { toast } = useToast();

	return (
		<div className="fixed right-3 top-1/2 -translate-y-1/2 transform rounded border-2 bg-white p-2 shadow-md">
			<ToolbarButton className="mb-2" onBtnClick={handleAddClick}>
				<Image
					className="object-contain"
					src={"/icons/plus.svg"}
					alt="Add"
					width={50}
					height={50}
				/>
			</ToolbarButton>
			<ToolbarButton onBtnClick={handleSaveClick}>
				<Image src={"/icons/save.svg"} alt="Save" width={50} height={50} />
			</ToolbarButton>
		</div>
	);

	function handleAddClick() {
		setNextId(nextId + 1);
		const newFormItems = [
			...formItems,
			{
				id: nextId,
				props: { ...constants.defaultTextInputProps },
			},
		];
		setFormItems(newFormItems);
	}

	function handleSaveClick() {
		debounceRefs.forEach((ref) => {
			ref.flush();
		});

		// doesn't really work, eg if hidden by accordion
		const errors = document.getElementsByClassName("error");
		if (errors.length !== 0) {
			errors[0].scrollIntoView();
			toast({
				title: "Error",
				description: "Please fix all invalid fields",
				duration: 2500,
			});
			return;
		}

		router.push(`../../new-form/save?formItems=${JSON.stringify(formItems)}`);
	}
};

export default Toolbar;
