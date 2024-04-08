import { MultipleChoiceProps } from "@/interfaces/form-component-interfaces/multiple-choice/MultipleChoiceProps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function MultipleChoiceComponent({
	props,
}: {
	props: MultipleChoiceProps;
}) {
	const isRadio = !props.allowMultiple;

	return (
		<Card className={"mb-4 w-10/12 self-center"}>
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
			</CardHeader>
			<CardContent>
				{isRadio ? (
					<RadioGroup defaultValue={props.items[0].value}>
						{props.items.map((item, index) => {
							return (
								<div className="flex items-center space-x-2" key={item.id}>
									<RadioGroupItem value={item.value} id={item.id} />
									<Label htmlFor={item.id}>{item.value}</Label>
								</div>
							);
						})}
					</RadioGroup>
				) : (
					<>
						{props.items.map((item, index) => {
							return (
								<div key={item.id} className="items-cen mb-4 flex">
									<Checkbox id="terms" />
									<label
										htmlFor="terms"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										{item.value}
									</label>
								</div>
							);
						})}
					</>
				)}
			</CardContent>
		</Card>
	);
}
