"use client";

import DateProps from "@/interfaces/form-component-interfaces/DateProps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { FormRendererContext } from "@/contexts/FormRendererContext";
import { FormItem } from "formhell-js";

export default function DateComponent({
	item,
	id,
}: {
	id: string;
	item: FormItem;
}) {
	const props = item.props as DateProps;
	const [date, setDate] = useState<Date>();
	const { formResponses } = useContext(FormRendererContext);

	return (
		<Card className={"mb-4 w-10/12 self-center"}>
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"w-[240px] justify-start text-left font-normal",
								!date && "text-muted-foreground",
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{date ? format(date, "PPP") : <span>Pick a date</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent align="start" className=" w-auto p-0">
						<Calendar
							mode="single"
							captionLayout="dropdown-buttons"
							selected={date}
							onSelect={(date) => {
								if (date) {
									setDate(date);
									formResponses[id] = { date: date, type: "date" };
								}
							}}
							fromYear={1960}
							toYear={2030}
						/>
					</PopoverContent>
				</Popover>
			</CardContent>
		</Card>
	);
}
