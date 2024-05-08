import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { SortableItemContext } from "@/contexts/SortableItemContext";
import TextInputProps from "@/interfaces/form-component-interfaces/TextInputProps";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
	ChangeEvent,
	memo,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { useDebouncedCallback } from "use-debounce";
import { Checkbox } from "../ui/checkbox";
import { SortableItem } from "./SortableItem";

export const TextInput = memo(function TextInput({
	id,
	props,
}: {
	id: string;
	props: TextInputProps;
}) {
	const [accordionOpen, setAccordionOpen] = useState(false);

	return (
		<SortableItem
			accordionOpen={accordionOpen}
			id={id}
			props={props}
			key={id}
			SortableItemChild={({ id, isFocused, props }) =>
				TextInputWrapper({
					id,
					isFocused,
					props,
					accordionOpen,
					setAccordionOpen,
				})
			}
		/>
	);
});

function TextInputWrapper({
	accordionOpen,
	setAccordionOpen,
	id,
	props,
	isFocused,
}: {
	accordionOpen: boolean;
	setAccordionOpen: (value: boolean) => void;
	id: string;
	isFocused: boolean;
	props: TextInputProps;
}) {
	return (
		<>
			{isFocused ? (
				<FocusedTextInput
					accordionOpen={accordionOpen}
					setAccordionOpen={setAccordionOpen}
					id={id}
					props={props}
				/>
			) : (
				<UnfocusedTextInput
					props={props}
					setAccordionOpen={setAccordionOpen}
				/>
			)}
		</>
	);
}

function FocusedTextInput({
	accordionOpen,
	id,
	props,
	setAccordionOpen,
}: {
	accordionOpen: boolean;
	setAccordionOpen: (value: boolean) => void;
	props: TextInputProps;
	id: string;
}) {
	const emailRegex = /.+@.+/;
	const positiveNumRegex = /^([1-9]\d*)?$/;

	const { debounceRefs } = useContext(FormBuilderContext);
	const { accordionContentRef } = useContext(SortableItemContext);

	const regexRef = useRef<HTMLInputElement>(null);
	const lengthsRef = useRef({
		minLength: props.minLength ? props.minLength.toString() : "",
		maxLength: props.maxLength ? props.maxLength.toString() : "",
	});

	const [lengthError, setLengthError] = useState("");
	const [regexError, setRegexError] = useState("");

	const handleIgnoreCaseChange = useDebouncedCallback((isChecked: boolean) => {
		props.regexFlags = isChecked ? "mi" : "m";
	}, constants.debounceWait);
	const handleMaxLengthChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			lengthsRef.current.maxLength = e.target.value;
			const _error = validateLength();
			setLengthError(_error);
			if (!_error) props.maxLength = Number(lengthsRef.current.maxLength);
		},
		constants.debounceWait,
	);
	const handleMinLengthChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			lengthsRef.current.minLength = e.target.value;
			const _error = validateLength();
			setLengthError(_error);
			if (!_error) props.minLength = Number(lengthsRef.current.minLength);
		},
		constants.debounceWait,
	);
	const handleRegexChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const newRegex = e.target.value;
			setRegex(newRegex);
		},
		constants.debounceWait,
	);
	const handlePlaceholderChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			props.placeholder = e.target.value;
		},
		constants.debounceWait,
	);

	useEffect(() => {
		const refs = debounceRefs.get(id);
		if (!refs) return;
		refs
			.set("ignore-case", handleIgnoreCaseChange)
			.set("max-length", handleMaxLengthChange)
			.set("min-length", handleMinLengthChange)
			.set("regex", handleRegexChange)
			.set("placeholder", handlePlaceholderChange);
	}, []);

	return (
		<CardContent>
			<div className="flex space-x-4">
				<div className="flex items-center">
					<Label htmlFor="inputType">Type</Label>
					<Select
						defaultValue={props.inputType}
						onValueChange={handleInputTypeChange}
					>
						<SelectTrigger className="ml-2 w-[180px]" id="inputType">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="short-text">Short Text</SelectItem>
							<SelectItem value="email">Email</SelectItem>
							<SelectItem value="number">Number</SelectItem>
							<SelectItem value="long-text">Long Text</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center">
					<Label htmlFor="placeholder">Placeholder</Label>
					<Input
						type="text"
						defaultValue={props.placeholder}
						id="placeholder"
						className="ml-2 w-72"
						maxLength={50}
						onChange={handlePlaceholderChange}
					/>
				</div>
			</div>

			{/* "accordion" */}
			<div>
				<div
					data-state={accordionOpen ? "open" : "closed"}
					onClick={handleAccordionToggle}
					className="custom-focus mt-2 flex w-full cursor-pointer items-center justify-between px-1 py-4 text-sm font-medium transition-all [&[data-state=open]>svg]:rotate-180"
				>
					Advanced
					<ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
				</div>
				<Separator />

				<div
					ref={accordionContentRef}
					className={
						"overflow-hidden px-[1px] pt-5 text-sm transition-all"
					}
				>
					<div className="text-base font-semibold">
						<u>Length</u>
					</div>

					<div className="flex w-full space-x-6 pt-3">
						<div className="flex">
							<div className="flex h-9 items-center">
								<Label htmlFor="min-length">Min. Length</Label>
							</div>
							<Input
								defaultValue={props.minLength || ""}
								className="ml-2 w-24"
								id="min-length"
								onChange={handleMinLengthChange}
								placeholder="0"
							/>
						</div>
						<div className="flex">
							<div className="flex h-9 items-center">
								<Label htmlFor="max-length">Max. Length</Label>
							</div>
							<Input
								defaultValue={props.maxLength || ""}
								className="ml-2 w-24"
								id="max-length"
								onChange={handleMaxLengthChange}
							/>
						</div>
						<Select
							defaultValue={props.lengthType}
							onValueChange={handleLengthTypeChange}
						>
							<SelectTrigger className="w-36">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="characters">Characters</SelectItem>
								<SelectItem value="words">Words</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="error">{lengthError}</div>

					<div className="text-base font-semibold">
						<u>Regex</u>
					</div>
					<div className="flex items-center space-x-6 pt-4">
						<Select
							defaultValue={props.regexMethod}
							onValueChange={handleRegexMethodChange}
						>
							<SelectTrigger className="w-36">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="contains">Contains</SelectItem>
								<SelectItem value="doesnt-contain">
									{"Doesn't contain"}
								</SelectItem>
								<SelectItem value="matches">Matches</SelectItem>
								<SelectItem value="doesnt-match">
									{"Doesn't match"}
								</SelectItem>
							</SelectContent>
						</Select>

						<div className="flex items-center space-x-2">
							<Label htmlFor="regex">Regex pattern</Label>
							<Input
								className="w-56"
								id="regex"
								ref={regexRef}
								defaultValue={props.regex.toString()}
								onChange={handleRegexChange}
								maxLength={1000}
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Label htmlFor="ignore-case">Ignore case</Label>
							<Checkbox
								id="ignore-case"
								defaultChecked={props.regexFlags === "mi"}
								onCheckedChange={handleIgnoreCaseChange}
							/>
						</div>
					</div>
					<div className="error">{regexError}</div>
				</div>
			</div>
		</CardContent>
	);

	function handleAccordionToggle() {
		setAccordionOpen(!accordionOpen);
	}

	function handleInputTypeChange(inputType: string) {
		switch (inputType) {
			case "short-text":
				props.inputType = "short-text";
				setRegex("");
				break;
			case "long-text":
				props.inputType = "long-text";
				setRegex("");
				break;
			case "email":
				props.inputType = "email";
				setRegex(emailRegex.toString());
				break;
			case "number":
				props.inputType = "number";
				setRegex(constants.intRegex.toString());
				break;
		}
	}

	function handleLengthTypeChange(newLengthType: string) {
		props.lengthType = newLengthType as "words" | "characters";
	}

	function handleRegexMethodChange(newRegexMethod: string) {
		props.regexMethod = newRegexMethod as
			| "contains"
			| "doesnt-contain"
			| "matches"
			| "doesnt-match";
	}

	function setRegex(newRegex: string) {
		newRegex = newRegex.trim();

		if (regexRef.current == null) return;
		regexRef.current.value = newRegex;

		try {
			new RegExp(newRegex);
			setRegexError("");
			props.regex = newRegex;
		} catch (e) {
			setRegexError("Enter a valid regex pattern");
		}
	}

	function validateLength(): string {
		const minLength = lengthsRef.current.minLength;
		const maxLength = lengthsRef.current.maxLength;

		const minNum = Number(minLength);
		const maxNum = Number(maxLength);

		if (
			!(
				minLength.match(positiveNumRegex) &&
				maxLength.match(positiveNumRegex)
			)
		) {
			return "Min. length and max. length must be positive integers";
		}
		if (maxNum > 99999) {
			return "Please enter a smaller max. length";
		}
		if (minNum > 99999) {
			return "Please enter a smaller min. length";
		}
		if (maxNum < minNum && maxLength) {
			return "Max. length must be greater than or equal to min. length";
		}
		return "";
	}
}

function UnfocusedTextInput({
	props,
	setAccordionOpen,
}: {
	props: TextInputProps;
	setAccordionOpen: (value: boolean) => void;
}) {
	useEffect(() => {
		setAccordionOpen(false);
	}, [setAccordionOpen]);

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
				<Input
					id="name"
					placeholder={props.placeholder || "Text"}
					disabled
					className="disabled:cursor-default disabled:opacity-100"
				/>
			</CardContent>
		</div>
	);
}
