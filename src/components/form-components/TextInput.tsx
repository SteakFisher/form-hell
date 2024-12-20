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
import { constants, textInputConstants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { SortableItemContext } from "@/contexts/SortableItemContext";
import { validateRegex } from "@/functions/validations/validateRegex";
import { TextInputProps } from "formhell-js";
import { FormItemMediaProps } from "formhell-js";
import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
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
import { buttonVariants } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { SortableItem } from "./SortableItem";

interface TextInputContextInterface {
	lengthError: string;
	lengthsRef: MutableRefObject<{
		minLength: string;
		maxLength: string;
	}>;
	regexError: string;
	regexRef: MutableRefObject<{
		pattern: string;
		flags: string;
	}>;
	setLengthError: (value: string) => void;
	setRegexError: (value: string) => void;
}

const TextInputContext = createContext<TextInputContextInterface>({
	lengthError: "",
	lengthsRef: { current: { minLength: "", maxLength: "" } },
	regexError: "",
	regexRef: { current: { pattern: "", flags: "" } },
	setLengthError: () => {},
	setRegexError: () => {},
});

export const TextInput = memo(function TextInput({
	id,
	mediaProps,
	props,
}: {
	id: string;
	mediaProps: FormItemMediaProps;
	props: TextInputProps;
}) {
	const [lengthError, setLengthError] = useState("");
	const [regexError, setRegexError] = useState("");

	const lengthsRef = useRef({
		minLength: String(props.minLength || ""),
		maxLength: String(props.maxLength || ""),
	});
	const regexRef = useRef({
		pattern: props.regexPattern,
		flags: props.regexFlags,
	});

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
				mediaProps={mediaProps}
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
	const [tooltipOpen, setTooltipOpen] = useState(false);

	const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const regexInputRef = useRef<HTMLInputElement>(null);
	const regexFlagsInputRef = useRef<HTMLInputElement>(null);

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

	const handleMultilineChange = useDebouncedCallback((isChecked: boolean) => {
		props.multiline = isChecked;
	}, constants.debounceWait);

	const handleRegexChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			regexRef.current.pattern = e.target.value;
			const _error = validateRegex(
				regexRef.current.pattern,
				regexRef.current.flags,
			);
			if (!_error) {
				props.regexPattern = regexRef.current.pattern;
				props.regexFlags = regexRef.current.flags;
			}
			setRegexError(_error);
		},
		constants.debounceWait,
	);

	const handleRegexFlagsChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			regexRef.current.flags = e.target.value;
			const _error = validateRegex(
				regexRef.current.pattern,
				regexRef.current.flags,
			);
			if (!_error) {
				props.regexPattern = regexRef.current.pattern;
				props.regexFlags = regexRef.current.flags;
			}
			setRegexError(_error);
		},
		constants.debounceWait,
	);

	useEffect(() => {
		const refs = debounceRefs.get(id);
		if (!refs) return;
		refs
			.set("max-length", handleMaxLengthChange)
			.set("min-length", handleMinLengthChange)
			.set("multiline", handleMultilineChange)
			.set("regex", handleRegexChange)
			.set("regex-flags", handleRegexFlagsChange);
	}, []);

	return (
		<CardContent className="mt-5">
			<div className="flex space-x-2">
				<Label htmlFor="multiline">Multiline</Label>
				<Checkbox
					id="multiline"
					onCheckedChange={handleMultilineChange}
					defaultChecked={props.multiline}
				/>
			</div>

			<Accordion
				type="single"
				collapsible
				value={accordionItem}
				onValueChange={handleAccordionToggle}
			>
				<AccordionItem value="item-1" className="border-b-0">
					<AccordionTrigger className="custom-focus mt-3 rounded-sm px-1 hover:no-underline">
						Validation
					</AccordionTrigger>
					<Separator />

					<AccordionContent className="mt-5 px-[1px]">
						<div className="mt-7">
							<div className="text-base font-semibold">
								<u>Length</u>
							</div>
							<div className="flex w-full space-x-6">
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
						</div>

						<div className="text-base font-semibold">
							<u>Regex</u>
						</div>
						<div className="mt-4 flex items-center space-x-6">
							<div className="flex items-center">
								<Select value="" onValueChange={handlePresetChange}>
									<SelectTrigger className="w-[100px]">
										<SelectValue placeholder="Presets" />
									</SelectTrigger>
									<SelectContent
										onCloseAutoFocus={(e) => e.preventDefault()}
									>
										<SelectItem value="email">Email</SelectItem>
										<SelectItem value="number">Number</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex items-center space-x-2">
								<Label htmlFor="regex">Pattern</Label>
								<Input
									className="w-56"
									defaultValue={regexRef.current.pattern}
									id="regex"
									maxLength={textInputConstants.regexPatternMaxLength}
									onChange={handleRegexChange}
									ref={regexInputRef}
								/>
							</div>
							<div className="flex items-center space-x-2">
								<Label htmlFor="flags">Flags</Label>
								<Input
									className="w-24"
									defaultValue={regexRef.current.flags}
									id="flags"
									maxLength={textInputConstants.regexFlagsMaxLength}
									onChange={handleRegexFlagsChange}
									ref={regexFlagsInputRef}
								/>
								<Popover
									open={tooltipOpen}
									onOpenChange={setTooltipOpen}
								>
									<div
										onMouseEnter={handleMouseEnter}
										onMouseLeave={handleMouseLeave}
									>
										<PopoverTrigger
											onClick={(e) => e.preventDefault()}
										>
											<InfoCircledIcon className="size-4 transition-opacity duration-200 hover:opacity-65" />
										</PopoverTrigger>
									</div>
									<PopoverContent
										onMouseEnter={() => {
											if (!closeTimeoutRef.current) return;
											clearTimeout(closeTimeoutRef.current);
										}}
										onMouseLeave={handleMouseLeave}
										className="w-auto border border-black bg-accent text-sm text-white"
										side="top"
										sideOffset={6}
									>
										<p className="whitespace-pre">
											{"Available flags: "}
											<code className="rounded-md bg-code px-1">
												d, g, i, m, s, u, v, y
											</code>
										</p>
										<a
											className={cn(
												buttonVariants({ variant: "link" }),
												"px-0",
											)}
											href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags"
											target="_blank"
										>
											MDN Reference
										</a>
									</PopoverContent>
								</Popover>
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
			handleMaxLengthChange.flush();
			handleMinLengthChange.flush();
			handleRegexChange.flush();
			handleRegexFlagsChange.flush();
		}
		setAccordionItem(value);
	}

	function handlePresetChange(inputType: string) {
		switch (inputType) {
			case "email":
				setRegexPattern(emailRegex.toString());
				break;
			case "number":
				setRegexPattern(constants.intRegex.toString());
				break;
		}
	}

	function handleLengthTypeChange(newLengthType: string) {
		props.lengthType = newLengthType as "words" | "characters";
	}

	function handleMouseEnter() {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
		}
		openTimeoutRef.current = setTimeout(() => {
			setTooltipOpen(true);
		}, 150);
	}

	function handleMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
		if (!openTimeoutRef.current) return;
		clearTimeout(openTimeoutRef.current);
		closeTimeoutRef.current = setTimeout(() => {
			setTooltipOpen(false);
		}, 150);
	}

	function setRegexPattern(newRegex: string) {
		if (regexInputRef.current == null) return;
		if (regexFlagsInputRef.current == null) return;

		regexInputRef.current.value = newRegex;
		regexFlagsInputRef.current.value = "";
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
		if (maxNum > textInputConstants.lengthsMax) {
			return "Please enter a smaller max. length";
		}
		if (minNum > textInputConstants.lengthsMax) {
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
		<CardContent>
			<Input
				id="name"
				placeholder="Enter your answer"
				disabled
				className="disabled:cursor-default disabled:opacity-100"
			/>
		</CardContent>
	);
}
