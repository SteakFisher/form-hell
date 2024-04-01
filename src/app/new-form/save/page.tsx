"use client";

import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { useContext } from "react";
import FormItem from "@/interfaces/FormItem";

export default function SavePage() {
	const formItems : FormItem[] = JSON.parse(localStorage.getItem("formItems") ?? "[]");

	return (
		<div>
			{JSON.stringify(formItems)}
			{/* {formItems.map((formItem) => {
				return (
					<div key={formItem.id}>
						<div>{formItem.id}</div>
						<div>{formItem.props.type}</div>
						<div>{JSON.stringify(formItem.props)}</div>
						<br></br>
					</div>
				);
			})} */}
		</div>
	);
}
