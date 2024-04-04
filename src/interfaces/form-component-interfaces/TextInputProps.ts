export default interface TextInputProps {
	inputType: string;
	lengthType: string;
	minLength: number;
	maxLength: number;
	placeholder: string;
	regex: RegExp;
	regexMethod: string;
	required: boolean;
	title: string;
	type: "text-input";
}
