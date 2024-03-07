"use client";

import { useSearchParams } from "next/navigation";
import FormItem from "../../interfaces/FormItem";

export default function SavePage() {
	const searchParams = useSearchParams();

	const formItemsParam = searchParams.get("formItems");
	if (!formItemsParam) return;
	const formItems: FormItem[] = JSON.parse(formItemsParam);

	return (
		<div>
			{formItems.map((formItem) => {
				return (
					<div key={formItem.id}>
						<div>{formItem.id}</div>
						<div>{formItem.type}</div>
						<div>{JSON.stringify(formItem.props)}</div>
						<br></br>
					</div>
				);
			})}
		</div>
	);
}