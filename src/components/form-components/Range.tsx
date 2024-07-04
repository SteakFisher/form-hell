import { constants, rangeConstants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { SortableItemContext } from "@/contexts/SortableItemContext";
import { RangeProps } from "@/interfaces/form-component-interfaces/RangeProps";
import { FormItemMediaProps } from "formhell-js";
import {
	ChangeEvent,
	createContext,
	memo,
	MutableRefObject,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { useDebouncedCallback } from "use-debounce";
import { CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { SortableItem } from "./SortableItem";

interface RangeContextInterface {
	rangeError: string;
	rangeRef: MutableRefObject<{
		min: string;
		max: string;
		step: string;
	}>;
	setRangeError: (value: string) => void;
}

const RangeContext = createContext<RangeContextInterface>({
	rangeError: "",
	rangeRef: { current: { min: "", max: "", step: "" } },
	setRangeError: () => {},
});

const Range = memo(function Range({
	id,
	mediaProps,
	props,
}: {
	id: string;
	mediaProps: FormItemMediaProps;
	props: RangeProps;
}) {
	const rangeRef = useRef({
		min: String(props.min),
		max: String(props.max),
		step: String(props.step),
	});
	const [rangeError, setRangeError] = useState("");

	return (
		<RangeContext.Provider value={{ rangeError, rangeRef, setRangeError }}>
			<SortableItem
				id={id}
				mediaProps={mediaProps}
				props={props}
				SortableItemChild={RangeWrapper}
			/>
		</RangeContext.Provider>
	);
});

const RangeWrapper = memo(function RangeWrapper({
	id,
	props,
	isFocused,
}: {
	id: string;
	isFocused: boolean;
	props: RangeProps;
}) {
	const { rangeError } = useContext(RangeContext);
	const { sortableItemRef } = useContext(SortableItemContext);

	useEffect(() => {
		sortableItemRef.current?.setAttribute(
			"data-error",
			rangeError ? "true" : "false",
		);
	}, [isFocused, rangeError, sortableItemRef]);

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
	const { rangeError, rangeRef, setRangeError } = useContext(RangeContext);
	const { sortableItemRef } = useContext(SortableItemContext);

	const handleMaxChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			rangeRef.current.max = e.target.value;
			const _error = validateRange();
			setRangeError(_error);
			if (!_error) {
				props.min = +rangeRef.current.min;
				props.max = +rangeRef.current.max;
				props.step = +rangeRef.current.step;
			}
		},
		constants.debounceWait,
	);
	const handleMinChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			rangeRef.current.min = e.target.value;
			const _error = validateRange();
			setRangeError(_error);
			if (!_error) {
				props.min = +rangeRef.current.min;
				props.max = +rangeRef.current.max;
				props.step = +rangeRef.current.step;
			}
		},
		constants.debounceWait,
	);

	const handleStepChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			rangeRef.current.step = e.target.value;
			const _error = validateRange();
			setRangeError(_error);
			if (!_error) {
				props.min = +rangeRef.current.min;
				props.max = +rangeRef.current.max;
				props.step = +rangeRef.current.step;
			}
		},
		constants.debounceWait,
	);

	useEffect(() => {
		const refs = debounceRefs.get(id);
		if (!refs) return;
		refs
			.set("max", handleMaxChange)
			.set("min", handleMinChange)
			.set("step", handleStepChange);
	}, []);

	useEffect(() => {
		sortableItemRef.current?.setAttribute(
			"data-error",
			rangeError ? "true" : "false",
		);
	}, [rangeError, sortableItemRef]);

	return (
		<CardContent className="mt-5 w-full justify-center pb-2">
			<div className="mt-3 flex w-min space-x-6 ">
				<div className="flex">
					<div className="flex h-9 items-center">
						<Label htmlFor="min">Min.</Label>
					</div>
					<Input
						defaultValue={rangeRef.current.min}
						className="ml-2 w-24"
						id="min"
						onChange={handleMinChange}
					/>
				</div>
				<div className="flex">
					<div className="flex h-9 items-center">
						<Label htmlFor="max">Max.</Label>
					</div>
					<Input
						defaultValue={rangeRef.current.max}
						className="ml-2 w-24"
						id="max"
						onChange={handleMaxChange}
					/>
				</div>
				<div className="flex">
					<div className="flex h-9 items-center">
						<Label htmlFor="step">Step</Label>
					</div>
					<Input
						defaultValue={rangeRef.current.step}
						className="ml-2 w-24"
						id="step"
						onChange={handleStepChange}
					/>
				</div>
			</div>
			<div className="error">{rangeError}</div>
		</CardContent>
	);

	function validateRange() {
		const min = rangeRef.current.min;
		const max = rangeRef.current.max;
		const step = rangeRef.current.step;

		const minNum = Number(min);
		const maxNum = Number(max);
		const stepNum = Number(step);

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
		const stepCount = (maxNum - minNum) / stepNum;
		if (stepCount < 1 || stepCount > rangeConstants.maxStepCount) {
			return `Step count must be between 1 and ${rangeConstants.maxStepCount}`;
		}

		return "";
	}
}

function UnfocusedRange({ props }: { props: RangeProps }) {
	return (
		<CardContent className="flex">
			{props.min || 0}
			<Slider className="pointer-events-none mx-2" disabled />
			{props.max || 1}
		</CardContent>
	);
}

export default Range;
