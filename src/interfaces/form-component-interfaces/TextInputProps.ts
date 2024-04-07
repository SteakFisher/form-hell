export default interface TextInputProps {
	inputType: "short-text" | "long-text" | "email" | "number";
	lengthType: string;
	minLength: number;
	maxLength: number;
	placeholder: string;
	regex: string;
	regexFlags: string;
	regexMethod: string;
	required: boolean;
	title: string;
	type: "text-input";
}
