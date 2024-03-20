"use client";

import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { useContext } from "react";

export default function SavePage() {
	const { formItems } = useContext(FormBuilderContext);

	return (
		<div>
			{formItems.map((formItem) => {
				return (
					<div key={formItem.id}>
						<div>{formItem.id}</div>
						<div>{formItem.props.type}</div>
						<div>{JSON.stringify(formItem.props)}</div>
						<br></br>
					</div>
				);
			})}
		</div>
	);
}
