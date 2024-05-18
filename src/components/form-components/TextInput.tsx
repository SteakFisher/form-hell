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
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";
import { SortableItem } from "./SortableItem";

interface TextInputContextInterface {
	lengthError: string;
	lengthsRef: MutableRefObject<{
		minLength: string;
		maxLength: string;
	}>;
	regexError: string;
	regexRef: MutableRefObject<string>;
	setLengthError: (value: string) => void;
	setRegexError: (value: string) => void;
}

const TextInputContext = createContext<TextInputContextInterface>({
	lengthError: "",
	lengthsRef: { current: { minLength: "", maxLength: "" } },
	regexError: "",
	regexRef: { current: "" },
	setLengthError: () => {},
	setRegexError: () => {},
});

export const TextInput = memo(function TextInput({
	id,
	props,
}: {
	id: string;
	props: TextInputProps;
}) {
	const [lengthError, setLengthError] = useState("");
	const [regexError, setRegexError] = useState("");

	const lengthsRef = useRef({
		minLength: String(props.minLength || ""),
		maxLength: String(props.maxLength || ""),
	});
	const regexRef = useRef(props.regex || "");

	return (
		<TextInputContext.Provider
			value={{
				lengthError,
				lengthsRef,
				regexError,
				regexRef,
				setLengthError,
				setRegexError,
			}}
		>
			<SortableItem
				id={id}
				props={props}
				SortableItemChild={TextInputWrapper}
			/>
		</TextInputContext.Provider>
	);
});

const TextInputWrapper = memo(function TextInputWrapper({
	id,
	props,
	isFocused,
}: {
	id: string;
	isFocused: boolean;
	props: TextInputProps;
}) {
	const { lengthError, regexError } = useContext(TextInputContext);
	const { sortableItemRef } = useContext(SortableItemContext);

	useEffect(() => {
		sortableItemRef.current?.setAttribute(
			"data-error",
			lengthError || regexError ? "true" : "false",
		);
	}, [isFocused, lengthError, regexError, sortableItemRef]);

	return (
		<>
			{isFocused ? (
				<FocusedTextInput id={id} props={props} />
			) : (
				<UnfocusedTextInput props={props} />
			)}
		</>
	);
});

function FocusedTextInput({
	id,
	props,
}: {
	id: string;
	props: TextInputProps;
}) {
	const emailRegex = /.+@.+/;
	const positiveNumRegex = /^([1-9]\d*)?$/;

	const { debounceRefs } = useContext(FormBuilderContext);
	const {
		lengthError,
		lengthsRef,
		regexError,
		regexRef,
		setLengthError,
		setRegexError,
	} = useContext(TextInputContext);

	const [accordionItem, setAccordionItem] = useState("");

	const regexInputRef = useRef<HTMLInputElement>(null);

	const handleIgnoreCaseChange = useDebouncedCallback((isChecked: boolean) => {
		props.regexFlags = isChecked ? "mi" : "m";
	}, constants.debounceWait);
	const handleMaxLengthChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			lengthsRef.current.maxLength = e.target.value;
			const _error = validateLength();
			setLengthError(_error);
			if (!_error) {
				props.minLength = +lengthsRef.current.minLength;
				props.maxLength = +lengthsRef.current.maxLength;
			}
		},
		constants.debounceWait,
	);
	const handleMinLengthChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			lengthsRef.current.minLength = e.target.value;
			const _error = validateLength();
			setLengthError(_error);

			if (!_error) {
				props.minLength = +lengthsRef.current.minLength;
				props.maxLength = +lengthsRef.current.maxLength;
			}
		},
		constants.debounceWait,
	);
	const handleRegexChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setRegex(e.target.value);
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
			.set("placeholder", handlePlaceholderChange)
			.set("regex", handleRegexChange);
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

			<Accordion
				type="single"
				collapsible
				value={accordionItem}
				onValueChange={handleAccordionToggle}
			>
				<AccordionItem value="item-1" className="border-b-0">
					<AccordionTrigger className="custom-focus mt-2 rounded-sm px-1 hover:no-underline">
						Advanced
					</AccordionTrigger>
					<Separator />

					<AccordionContent className="mt-5 px-[1px]">
						<div className="text-base font-semibold">
							<u>Length</u>
						</div>

						<div className="mt-3 flex w-full space-x-6">
							<div className="flex">
								<div className="flex h-9 items-center">
									<Label htmlFor="min-length">Min. Length</Label>
								</div>
								<Input
									defaultValue={lengthsRef.current.minLength || ""}
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
									defaultValue={lengthsRef.current.maxLength || ""}
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
									<SelectItem value="characters">
										Characters
									</SelectItem>
									<SelectItem value="words">Words</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="error">{lengthError}</div>

						<div className="mt-5 text-base font-semibold">
							<u>Regex</u>
						</div>
						<div className="mt-4 flex items-center space-x-6">
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
									ref={regexInputRef}
									defaultValue={regexRef.current}
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
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</CardContent>
	);

	function handleAccordionToggle(value: string) {
		if (value === "") {
			handleIgnoreCaseChange.flush();
			handleMaxLengthChange.flush();
			handleMinLengthChange.flush();
			handleRegexChange.flush();
		}
		setAccordionItem(value);
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
		regexRef.current = newRegex;
		newRegex = newRegex.trim();

		try {
			new RegExp(newRegex);
			setRegexError("");
			props.regex = newRegex;
		} catch (e) {
			setRegexError("Enter a valid regex pattern");
		}

		if (regexInputRef.current == null) return;
		regexInputRef.current.value = newRegex;
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

function UnfocusedTextInput({ props }: { props: TextInputProps }) {
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
