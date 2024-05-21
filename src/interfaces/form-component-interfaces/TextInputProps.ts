export default interface TextInputProps {
	lengthType: "words" | "characters";
	minLength: number;
	maxLength: number;
	multiline: boolean;
	regex: string;
	regexFlags: string;
	required: boolean;
	title: string;
	type: "text-input";
}
