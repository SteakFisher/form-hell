"use client";

import React, { useContext, useState } from "react";
import ToolbarButton from "./ToolbarButton";
import Image from "next/image";
import { FormBuilderContext } from "@/app/contexts/FormBuilderContext";

const Toolbar = () => {
	const { formItems, setFormItems } = useContext(FormBuilderContext);
	const [nextId, setNextId] = useState(formItems.length + 1);

	return (
		<div className="bg-white rounded border-2 shadow-md p-2 fixed right-3 top-1/2 transform -translate-y-1/2">
			<ToolbarButton className="mb-2" onBtnClick={handleAddClick}>
				<Image
					className="object-contain"
					src={"/icons/plus.svg"}
					alt=""
					width={50}
					height={50}
				/>
			</ToolbarButton>

			<ToolbarButton onBtnClick={handleDeleteClick}>
				<Image src={"/icons/delete.svg"} alt="" width={50} height={50} />
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
				props: { placeholder: nextId.toString() },
			},
		];
		setFormItems(newFormItems);
	}

	function handleDeleteClick() {
		return;
	}
};

export default Toolbar;
