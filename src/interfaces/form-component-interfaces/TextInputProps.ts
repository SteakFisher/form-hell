type TextInputProps = {
	lengthType: "words" | "characters";
	minLength: number;
	maxLength: number;
	multiline: boolean;
	regexPattern: string;
	regexFlags: string;
	required: boolean;
	title: string;
	type: "text-input";
};

export default TextInputProps;
