import React, {
	ChangeEvent,
	memo,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { SortableItem } from "./SortableItem";
import { RangeProps } from "@/interfaces/form-component-interfaces/RangeProps";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { constants } from "@/constants";
import { useDebouncedCallback } from "use-debounce";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";

function Range({
	id,
	props,
	showAdd,
}: {
	id: string;
	props: RangeProps;
	showAdd: boolean;
}) {
	return (
		<SortableItem
			id={id}
			props={props}
			showAdd={showAdd}
			SortableItemChild={RangeWrapper}
		/>
	);
}

const RangeWrapper = memo(function RangeWrapper({
	id,
	props,
	isFocused,
}: {
	id: string;
	isFocused: boolean;
	props: RangeProps;
}) {
	return (
		<>
			{isFocused ? (
				<FocusedRange id={id} props={props} />
			) : (
				<UnfocusedRange props={props} />
			)}
		</>
	);
});

function FocusedRange({ props, id }: { props: RangeProps; id: string }) {
	const { debounceRefs } = useContext(FormBuilderContext);
	const rangeRef = useRef({
		min: props.min,
		max: props.max,
		step: props.step,
	});
	const [rangeError, setRangeError] = useState("");

	const handleMaxChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			rangeRef.current.max = e.target.value;
			const _error = validateRange();
			setRangeError(_error);
			if (!_error) props.max = rangeRef.current.max;
		},
		constants.debounceWait,
	);
	const handleMinChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			rangeRef.current.min = e.target.value;
			const _error = validateRange();
			setRangeError(_error);
			if (!_error) props.min = rangeRef.current.min;
		},
		constants.debounceWait,
	);

	const handleStepChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			rangeRef.current.step = e.target.value;
			const _error = validateRange();
			setRangeError(_error);
			if (!_error) props.step = rangeRef.current.step;
		},
		constants.debounceWait,
	);

	useEffect(() => {
		debounceRefs
			.set(`${id}max`, handleMaxChange)
			.set(`${id}min`, handleMinChange)
			.set(`${id}step`, handleStepChange);
	});

	return (
		<CardContent className="w-full justify-center">
			<div className="mt-3 flex w-min space-x-6 ">
				<div className="flex">
					<div className="flex h-9 items-center">
						<Label htmlFor="min">Min.</Label>
					</div>
					<Input
						defaultValue={props.min}
						className="ml-2 w-24"
						id="min"
						onChange={handleMinChange}
						placeholder="0"
					/>
				</div>
				<div className="flex">
					<div className="flex h-9 items-center">
						<Label htmlFor="max">Max.</Label>
					</div>
					<Input
						defaultValue={props.max}
						className="ml-2 w-24"
						id="max"
						onChange={handleMaxChange}
						placeholder="1"
					/>
				</div>
				<div className="flex">
					<div className="flex h-9 items-center">
						<Label htmlFor="step">Step</Label>
					</div>
					<Input
						defaultValue={props.step}
						className="ml-2 w-24"
						id="step"
						onChange={handleStepChange}
						placeholder="1"
					/>
				</div>
			</div>
			{rangeError && <div className="error">{rangeError}</div>}
		</CardContent>
	);

	function validateRange() {
		const min = rangeRef.current.min;
		const max = rangeRef.current.max;
		const step = rangeRef.current.step;

		const minNum = min ? Number(min) : 0;
		const maxNum = max ? Number(max) : 1;
		const stepNum = step ? Number(step) : 1;

		if (
			!(
				min.match(constants.intRegex) &&
				max.match(constants.intRegex) &&
				step.match(constants.intRegex)
			)
		) {
			return "Min., max. and step must be integers";
		}
		if (maxNum <= minNum) {
			return "Max. must be greater than Min.";
		}
		const range = (maxNum - minNum) / stepNum;
		if (range < 1 || range > 50) {
			return "Range must be between 1 and 50";
		}

		return "";
	}
}

function UnfocusedRange({ props }: { props: RangeProps }) {
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
			<CardContent className="flex">
				{props.min || 0}
				<Slider className="pointer-events-none mx-2" disabled />
				{props.max || 1}
			</CardContent>
		</div>
	);
}

export default Range;
