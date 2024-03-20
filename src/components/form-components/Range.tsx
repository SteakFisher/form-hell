import React from "react";
import { SortableItem } from "./SortableItem";
import { RangeProps } from "@/interfaces/form-component-interfaces/RangeProps";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";

function Range({ id, props }: { id: number; props: RangeProps }) {
	return (
		<SortableItem
			UnfocusedSortableItem={() => UnfocusedRange(props)}
			id={id}
			props={props}
		>
			<CardContent className="w-full justify-center">
				<div className="mt-3 flex w-min space-x-6 ">
					<div className="flex">
						<div className="flex h-9 items-center">
							<Label htmlFor="min">Min.</Label>
						</div>
						<Input
							className="ml-2 w-24"
							id="min"
							// onChange={handleMinLengthChange}
							placeholder="0"
						/>
					</div>
					<div className="flex">
						<div className="flex h-9 items-center">
							<Label htmlFor="max">Max.</Label>
						</div>
						<Input
							className="ml-2 w-24"
							id="max"
							// onChange={handleMaxLengthChange}
						/>
					</div>
					<div className="flex">
						<div className="flex h-9 items-center">
							<Label htmlFor="step">Step</Label>
						</div>
						<Input
							className="ml-2 w-24"
							id="step"
							// onChange={handleMaxLengthChange}
						/>
					</div>
				</div>
				<Slider className="pt-10" min={0} max={4} step={3} />
			</CardContent>
		</SortableItem>
	);
}

function UnfocusedRange(props: RangeProps) {
	return (
		<div className="h-min w-full whitespace-pre-wrap">
			<CardHeader>
				<CardTitle className="flex text-base">
					<span>{props.title || "Title"}</span>
					<span>
						{props.required ? (
							<sup className="ml-2 text-red-500">*</sup>
						) : null}
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Slider disabled />
			</CardContent>
		</div>
	);
}

export default Range;
