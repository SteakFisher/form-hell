import TitleProps from "./interfaces/form-component-interfaces/TitleProps";

const TitlePropsObj: TitleProps = {
	description: "",
	title: "",
	type: "title",
};

export const constants = Object.freeze({
	defaultTextInputProps: {
		inputType: "short-text",
		lengthType: "characters",
		minLength: "",
		maxLength: "",
		placeholder: "",
		regex: "",
		regexMethod: "contains",
		required: "false",
		title: "",
		type: "text-input",
	},
	defaultTitleProps: TitlePropsObj,
	debounceWait: 500,
	emailRegex: /.+@.+/,
	numRegex: /^(0|[1-9]\d*)?$/,
});
