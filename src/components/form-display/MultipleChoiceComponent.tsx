import { MultipleChoiceProps } from "@/interfaces/form-component-interfaces/multiple-choice/MultipleChoiceProps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, {useContext, useState} from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {FormRendererContext} from "@/contexts/FormRendererContext";
import MultipleChoiceResponse from "@/interfaces/form-component-response-interfaces/MultipleChoiceResponse";

export default function MultipleChoiceComponent({
	props,
	id
}: {
	props: MultipleChoiceProps;
	id: string;
}) {
	const isRadio = !props.allowMultiple;
	const { formResponses } = useContext(FormRendererContext);
	const [selected, setSelected] = useState<Set<string>>(new Set());
	formResponses[id] = { type: "multiple-choice", selected: selected } as MultipleChoiceResponse;

	return (
		<Card className={"mb-4 w-10/12 self-center"}>
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
			</CardHeader>
			<CardContent>
				{isRadio ? (
					<RadioGroup onValueChange={(value) => {
						formResponses[id].selected = new Set([value]);
					}} defaultValue={props.items[0].value}>
						{props.items.map((item, index) => {
							return (
								<div className="flex items-center space-x-2" key={item.id}>
									<RadioGroupItem value={item.value} id={item.id} />
									<Label htmlFor={item.id}>{item.value}</Label>
								</div>
							);
						})}
						{
							props.hasOther ? (
								<div className="flex items-center space-x-2" key={props.items[0].parentId}>
									<RadioGroupItem value={"other"} id={props.items[0].parentId + "-other"} />
									<Label htmlFor={props.items[0].parentId + "-other"}>{"other"}</Label>
								</div>
							) : null
						}
					</RadioGroup>
				) : (
					<>
						{props.items.map((item, index) => {
							return (
								<div key={item.id} className="items-cen mb-4 flex">
									<Checkbox id={item.id + "-checkbox"} checked={selected.has(item.value)} onCheckedChange={(e) => {
										if (e && !selected.has("other")) {
											formResponses[id].selected.add(item.value);
											setSelected(new Set(formResponses[id].selected));
										} else if (!selected.has("other")) {
											formResponses[id].selected.delete(item.value);
											setSelected(new Set(formResponses[id].selected));
										}
									}} />
									<label
										htmlFor={item.id + "-checkbox"}
										className="text-sm ml-2 mt-0.5 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										{item.value}
									</label>
								</div>
							);
						})}
						{
							props.hasOther ? (
								<div key={id + "-other"} className="items-cen mb-4 flex">
									<Checkbox id="other" checked={selected.has("other")} onCheckedChange={(e) => {
										if (e) {
											setSelected(new Set(["other"]));
											formResponses[id].selected = new Set(["other"]);
										} else {
											setSelected(new Set([]));
											formResponses[id].selected = new Set([]);
										}
									}}/>
									<label
										htmlFor="other"
										className="text-sm ml-2 mt-0.5 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										other
									</label>
								</div>
							) : null
						}
					</>
				)}
			</CardContent>
		</Card>
	);
}
