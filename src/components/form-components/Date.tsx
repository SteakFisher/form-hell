import React, { memo } from "react";
import { SortableItem } from "./SortableItem";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import DateProps from "@/interfaces/form-component-interfaces/DateProps";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

function Date({
	props,
	id,
}: {
	props: DateProps;
	id: string;
}) {
	return (
		<SortableItem
			id={id}
			props={props}
			SortableItemChild={DateWrapper}
		/>
	);
}

const DateWrapper = memo(function DateWrapper({
	id,
	props,
	isFocused,
}: {
	id: string;
	isFocused: boolean;
	props: DateProps;
}) {

	return <>
		{isFocused ? <FocusedDate /> : <UnfocusedDate props={props} />}
	</>
});

function FocusedDate() {
	return (
		<CardContent>
			<Button
				disabled
				variant="outline"
				className="w-60 justify-start text-left font-normal text-muted-foreground disabled:opacity-100"
			>
				<span>Pick a date</span>
				<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
			</Button>
		</CardContent>
	);
}

function UnfocusedDate({ props }: { props: DateProps }) {
	return (
		<div className="h-min w-full whitespace-pre-wrap">
			<CardHeader>
				<CardTitle className="flex leading-snug [overflow-wrap:anywhere]">
					<span>{props.title || "Title"}</span>
					<span>
						{props.required && <sup className="ml-2 text-red-500">*</sup>}
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Button
					disabled
					variant="outline"
					className="w-60 justify-start text-left font-normal text-muted-foreground disabled:opacity-100"
				>
					<span>Pick a date</span>
					<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
				</Button>
			</CardContent>
		</div>
	);
}

export default Date;
