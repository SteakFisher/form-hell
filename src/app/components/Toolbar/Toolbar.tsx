"use client";

import { constants } from "@/app/constants";
import { FormBuilderContext } from "@/app/contexts/FormBuilderContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import ToolbarButton from "./ToolbarButton";

const Toolbar = () => {
	const { formItems, setFormItems, debounceRefs } = useContext(FormBuilderContext);
	const [nextId, setNextId] = useState(formItems.length);
	const router = useRouter();

	return (
		<div className="bg-white rounded border-2 shadow-md p-2 fixed right-3 top-1/2 transform -translate-y-1/2">
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
				type: "text-input",
				props: { ...constants.defaultTextInputProps },
			},
		];
		setFormItems(newFormItems);
	}

	function handleSaveClick() {
		debounceRefs.forEach((ref)=>{ref.flush();})
		router.push(`../../new-form/save?formItems=${JSON.stringify(formItems)}`);
	}
};

export default Toolbar;
