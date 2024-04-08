export default interface TextInputProps {
	inputType: "short-text" | "long-text" | "number" | "email";
	lengthType: "words" | "characters";
	minLength: number;
	maxLength: number;
	placeholder: string;
	regex: string;
	regexFlags: string;
	regexMethod: "contains" | "doesnt-contain" | "matches" | "doesnt-match";
	required: boolean;
	title: string;
	type: "text-input";
}
