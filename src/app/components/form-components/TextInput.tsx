import { constants } from "@/app/constants";
import { FormBuilderContext } from "@/app/contexts/FormBuilderContext";
import TextInputProps from "@/app/interfaces/form-component-interfaces/TextInputProps";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { CardContent } from "@/components/ui/card";
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
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { SortableItem } from "./SortableItem";

export function TextInput({
	id,
	props,
}: {
	id: number;
	props: TextInputProps;
}) {
	const emailRegex = /.+@.+/;
	const numRegex = /^(0|[1-9]\d*)?$/;

	const { debounceRefs } = useContext(FormBuilderContext);
	const [accordionItem, setAccordionItem] = useState("");
	const [lengthError, setLengthError] = useState("");
	const [regexError, setRegexError] = useState("");
	const regexRef = useRef<HTMLInputElement>(null);
	const lengthsRef = useRef({
		minLength: props.minLength,
		maxLength: props.maxLength,
	});

	const handleMaxLengthChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			lengthsRef.current.maxLength = e.target.value;
			const _error = validateLength();
			setLengthError(_error);
			if (!_error) props.maxLength = lengthsRef.current.maxLength;
		},
		constants.debounceWait,
	);
	const handleMinLengthChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			lengthsRef.current.minLength = e.target.value;
			const _error = validateLength();
			setLengthError(_error);
			if (!_error) props.minLength = lengthsRef.current.minLength;
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
		debounceRefs
			.set(`${id}:max-length`, handleMaxLengthChange)
			.set(`${id}:min-length`, handleMinLengthChange)
			.set(`${id}:regex`, handleRegexChange)
			.set(`${id}:placeholder`, handlePlaceholderChange);
	}, []);

	return (
		<SortableItem id={id} props={props} key={id}>
			<CardContent>
				<div className="flex space-x-4">
					<div className="flex items-center">
						<Label htmlFor="inputType">Type</Label>
						<Select
							defaultValue="short-text"
							onValueChange={handleInputTypeChange}
						>
							<SelectTrigger className="ml-2 w-[180px]" id="inputType">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="short-text">Short Text</SelectItem>
								<SelectItem value="email">Email</SelectItem>
								<SelectItem value="numeric">Numeric</SelectItem>
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
						{/* extra div for straight border-b */}
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
							{lengthError && <div className="error">{lengthError}</div>}

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

								<div className="flex items-center">
									<Label htmlFor="regex">Regex pattern</Label>
									<Input
										className="ml-2 w-56"
										id="regex"
										ref={regexRef}
										defaultValue={props.regex}
										onChange={handleRegexChange}
										maxLength={1000}
									/>
								</div>
							</div>
							{regexError && <div className="error">{regexError}</div>}
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</CardContent>
		</SortableItem>
	);

	function handleAccordionToggle() {
		setAccordionItem(accordionItem ? "" : "item-1");
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
			case "numeric":
				props.inputType = "numeric";
				setRegex(numRegex.toString());
				break;
		}
	}

	function handleLengthTypeChange(newLengthType: string) {
		props.lengthType = newLengthType;
	}

	function handleRegexMethodChange(newRegexMethod: string) {
		props.regexMethod = newRegexMethod;
	}

	function setRegex(newRegex: string) {
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

		if (maxLength !== "" && maxNum === 0 && maxNum === 0)
			return "Both values cannot be zero";
		if (!(minLength.match(numRegex) && maxLength.match(numRegex))) {
			return "Both values must be positive integers or zero";
		}
		if (minNum > 999999999 || maxNum > 999999999) {
			return "Please enter a smaller number";
		}
		if (maxNum < minNum && maxNum && minNum) {
			return "Max. length must be greater than or equal to min. length";
		}
		return "";
	}
}
