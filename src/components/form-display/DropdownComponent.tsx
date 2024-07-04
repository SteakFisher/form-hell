"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { DropdownProps, FormItem } from "formhell-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContext } from "react";
import { FormRendererContext } from "@/contexts/FormRendererContext";

export default function DropdownComponent({
	item,
	id,
}: {
	id: string;
	item: FormItem;
}) {
	const { formResponses } = useContext(FormRendererContext);
	const props = item.props as DropdownProps;
	return (
		<Card className={"mb-4 w-10/12 self-center"}>
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<Select
					onValueChange={(value) => {
						props.items.map((item) => {
							if (item.value === value) {
								formResponses[id] = {
									selected: item.id,
									type: "dropdown",
								};
							}
						});
					}}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select Item" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{props.items.map((item, index) => {
								return (
									<SelectItem key={index} value={item.value}>
										{item.value}
									</SelectItem>
								);
							})}
						</SelectGroup>
					</SelectContent>
				</Select>
			</CardContent>
		</Card>
	);
}
