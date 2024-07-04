"use client";

import React, { useContext, useEffect, useState } from "react";
import { FormRendererContext } from "@/contexts/FormRendererContext";
import MultipleChoiceGridProps from "@/interfaces/form-component-interfaces/multiple-choice-grid/MultipleChoiceGridProps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MultipleChoiceGridResponse } from "formhell-js";
import { FormItem } from "formhell-js";

type Selected = {
	[rowId: string]: Set<string>;
};

export default function MultipleChoiceGridComponent({
	item,
	id,
}: {
	item: FormItem;
	id: string;
}) {
	const props = item.props as MultipleChoiceGridProps;
	const isRadio = !props.allowMultiple;
	const { formResponses } = useContext(FormRendererContext);

	const [selected, setSelected] = useState<Selected>({});
	formResponses[id] = {
		type: "multiple-choice-grid",
		selected: selected,
	} as MultipleChoiceGridResponse;

	props.columns[0].id;
	return (
		<Card className={"mb-4 w-10/12 self-center"}>
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex min-h-8 items-center space-x-2">
					<div className="flex-1" />
					{props.columns.map((column, index) => (
						<span
							key={index + "-column"}
							className="flex-1 truncate text-center"
						>
							{column.value}
						</span>
					))}
				</div>
				{props.rows.map((row, index) => {
					return (
						<RadioGroup
							key={index + "-row"}
							onValueChange={(value) => {
								selected[row.id] = new Set([value]);
							}}
						>
							<div className="flex min-h-8 items-center space-x-2">
								<span className="flex-1 truncate">{row.value}</span>
								{props.columns.map((column, index) => (
									<div
										key={`${column.id}-${row.id}`}
										className="flex flex-1 items-center justify-center"
									>
										{isRadio ? (
											<RadioGroupItem
												className="size-5 shrink-0"
												value={column.id}
											/>
										) : (
											<Checkbox
												className="disabled:cursor-default disabled:opacity-100"
												checked={
													selected[row.id] &&
													selected[row.id].has(column.id)
												}
												onCheckedChange={(checked) => {
													if (checked) {
														if (!selected[row.id]) {
															selected[row.id] = new Set([
																column.id,
															]);
															setSelected({ ...selected });
														} else {
															selected[row.id].add(column.id);
															setSelected({ ...selected });
														}
													} else {
														if (selected[row.id]) {
															selected[row.id].delete(column.id);
															setSelected({ ...selected });
														}
													}
												}}
											/>
										)}
									</div>
								))}
							</div>
						</RadioGroup>
					);
				})}
			</CardContent>
		</Card>
	);
}
