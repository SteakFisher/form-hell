import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SortableItem } from "./SortableItem";
import { ChangeEvent, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TextInputProps {
	id: number;
	placeholder: string;
}

export function TextInput({ id, placeholder }: TextInputProps) {
	const [inputType, setInputType] = useState("short-text");
	const isInputLong = inputType === "long-text";
	const [minLength, setMinLength] = useState("");
	const [maxLength, setMaxLength] = useState("");
	const [lengthError, setLengthError] = useState("");
	const [lengthType, setLengthType] = useState("characters");
	const [regex, _setRegex] = useState("");
	const [regexError, setRegexError] = useState("");
	const numRegex = /^(0|[1-9]\d*)$/;

	return (
		<SortableItem id={id} title="Text Input">
			<CardContent>
				{isInputLong ? (
					<Textarea placeholder={placeholder} className="resize-none" />
				) : (
					<Input type={inputType} placeholder={placeholder} />
				)}
				<Select
					defaultValue={inputType}
					onValueChange={handleInputTypeChange}
				>
					<SelectTrigger className="w-[180px] mt-5">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="short-text">Short Text</SelectItem>
						<SelectItem value="email">Email</SelectItem>
						<SelectItem value="numeric">Number</SelectItem>
						<SelectItem value="tel">Tel</SelectItem>
						<SelectItem value="long-text">Long Text</SelectItem>
					</SelectContent>
				</Select>
				<Accordion type="single" collapsible>
					<AccordionItem value="item-1" className="border-b-0">
						<AccordionTrigger className="border-b hover:no-underline">
							Advanced
						</AccordionTrigger>
						<AccordionContent className="mt-5">
							<span className="text-base font-semibold">
								<u>Validation</u>
							</span>

							<div className="flex w-full mt-3 justify-between">
								<div className="flex">
									<div className="flex h-9 items-center">
										<Label htmlFor="min-length">Min. Length</Label>
									</div>
									<div className="flex flex-col ml-2">
										<Input
											className="w-24"
											id="min-length"
											value={minLength}
											onChange={handleMinLengthChange}
											placeholder="0"
										/>
									</div>
								</div>
								<div className="flex">
									<div className="flex h-9 items-center">
										<Label htmlFor="max-length">Max. Length</Label>
									</div>
									<Input
										className="w-24 ml-2"
										id="max-length"
										value={maxLength}
										onChange={handleMaxLengthChange}
									/>
								</div>
								<div className="flex mr-[1px]">
									<div className="flex h-9 items-center">
										<Select
											defaultValue={lengthType}
											onValueChange={setLengthType}
										>
											<SelectTrigger className="w-32">
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
								</div>
							</div>
							{lengthError && (
								<div className="error">
									<span>{lengthError}</span>
								</div>
							)}
							<div className="flex mt-4 items-center">
								<Label htmlFor="regex">Regex</Label>
								<Input
									className="w-56 ml-2"
									id="regex"
									value={regex}
									onChange={handleRegexChange}
								/>
							</div>
							{regexError && (
								<div className="error">
									<span>{regexError}</span>
								</div>
							)}
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</CardContent>
		</SortableItem>
	);

	function handleMinLengthChange(e: ChangeEvent<HTMLInputElement>) {
		const newMinLength = e.target.value;
		setMinLength(newMinLength);
		setLengthError(validateLength(newMinLength, maxLength));
	}

	function handleMaxLengthChange(e: ChangeEvent<HTMLInputElement>) {
		const newMaxLength = e.target.value;
		setMaxLength(newMaxLength);
		setLengthError(validateLength(minLength, newMaxLength));
	}

	function validateLength(min: string, max: string): string {
		const minNum = Number(min);
		const maxNum = Number(max);

		if (!(minNum > -1 && maxNum > -1)) {
			return "Both values must be positive integers or zero.";
		}
		if (maxNum < minNum) {
			return "Max. length must be greater than or equal to min. length";
		}
		return "";
	}

	function handleRegexChange(e: ChangeEvent<HTMLInputElement>) {
		const newRegex = e.target.value;
		setRegex(newRegex);
	}

	function setRegex(newRegex: string) {
		_setRegex(newRegex);

		try {
			new RegExp(newRegex);
			regexError ? setRegexError("") : null;
		} catch (e) {
			regexError ? null : setRegexError("Enter a valid regex pattern");
		}
	}

	function handleInputTypeChange(inputType: string) {
		switch (inputType) {
			case "short-text":
				setInputType("short-text");
				break;
			case "long-text":
				setInputType("long-text");
				break;
			case "email":
				setInputType("email");
				break;
			case "numeric":
				setInputType("numeric");
				setRegex(numRegex.toString());
				break;
			case "tel":
				setInputType("tel");
				break;
			default:
				return;
		}
	}
}
