"use client";

import { MultipleChoiceProps } from "formhell-js";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import React, { useContext, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { FormRendererContext } from "@/contexts/FormRendererContext";
import { MultipleChoiceResponse, MultipleChoiceOther } from "formhell-js";
import { Input } from "@/components/ui/input";
import ChildMediaComponent from "@/components/form-display/ChildMediaComponent";
import { FormItem } from "formhell-js";

export default function MultipleChoiceComponent({
	item,
	id,
}: {
	item: FormItem;
	id: string;
}) {
	const props = item.props as MultipleChoiceProps;
	const isRadio = !props.allowMultiple;
	const [selected, setSelected] = useState<MultipleChoiceOther>({});
	const { formResponses } = useContext(FormRendererContext);
	formResponses[id] = { selected: selected, type: "multiple-choice" };
	let response = formResponses[id] as MultipleChoiceResponse;
	const inputRef = useRef(null as HTMLInputElement | null);
	let multipleChoiceResponse = response.selected as MultipleChoiceOther;

	return (
		<Card className={"mb-4 w-10/12 self-center"}>
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
			</CardHeader>
			<CardFooter className={"flex flex-grow justify-center"}>
				<ChildMediaComponent props={item.mediaProps} />
			</CardFooter>
			<CardContent>
				{isRadio ? (
					<RadioGroup
						onValueChange={(value) => {
							if (value !== "other") {
								multipleChoiceResponse = { [value]: "value" };
								setSelected(multipleChoiceResponse);
							} else {
								multipleChoiceResponse = {
									other: inputRef.current
										? inputRef.current.value
										: "",
								};
								setSelected(multipleChoiceResponse);
							}
						}}
					>
						{props.items.map((item, index) => {
							return (
								<div
									className="mt-2 flex items-center space-x-2"
									key={item.id}
								>
									<RadioGroupItem value={item.id} id={item.id} />
									<Label htmlFor={item.id}>{item.value}</Label>
								</div>
							);
						})}
						{props.hasOther ? (
							<div
								className="flex items-center space-x-2"
								key={id}
							>
								<RadioGroupItem
									value={"other"}
									id={id + "-other"}
								/>
								<Input
									ref={inputRef}
									disabled={
										multipleChoiceResponse["other"] == undefined
									}
									onChange={(e) => {
										multipleChoiceResponse["other"] = e.target.value;
										setSelected(multipleChoiceResponse);
									}}
									placeholder={"other"}
								/>
							</div>
						) : null}
					</RadioGroup>
				) : (
					<>
						{props.items.map((item, index) => {
							return (
								<div key={item.id} className="items-cen mb-4 flex">
									<Checkbox
										checked={!!selected[item.id]}
										onCheckedChange={(e) => {
											if (
												e &&
												multipleChoiceResponse["other"] == undefined
											) {
												multipleChoiceResponse[item.id] = "value";
												setSelected({ ...multipleChoiceResponse });
											} else {
												delete multipleChoiceResponse[item.id];
												setSelected({ ...multipleChoiceResponse });
											}
										}}
										id={item.id + "-checkbox"}
									/>
									<label
										htmlFor={item.id + "-checkbox"}
										className="ml-2 mt-0.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										{item.value}
									</label>
								</div>
							);
						})}
						{props.hasOther ? (
							<div key={id + "-other"} className="items-cen mb-4 flex">
								<Checkbox
									onCheckedChange={(e) => {
										if (e) {
											multipleChoiceResponse = {
												other: inputRef.current
													? inputRef.current.value
													: "",
											};
											setSelected(multipleChoiceResponse);
										} else {
											multipleChoiceResponse = {};
											setSelected(multipleChoiceResponse);
										}
									}}
									id="other"
								/>
								<Input
									ref={inputRef}
									disabled={
										multipleChoiceResponse["other"] == undefined
									}
									className={"ml-2 flex items-center justify-center"}
									placeholder={"other"}
									onChange={(e) => {
										multipleChoiceResponse["other"] = e.target.value;
										setSelected(multipleChoiceResponse);
									}}
								/>
							</div>
						) : null}
					</>
				)}
			</CardContent>
		</Card>
	);
}
