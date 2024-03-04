import TextInputProps from "./interfaces/form-component-interfaces/TextInputProps";
import TitleProps from "./interfaces/form-component-interfaces/TitleProps";

const TitlePropsObj: TitleProps = {
	description: "",
	title: "",
	type: "title",
};

const TextInputPropsObj: TextInputProps = {
	inputType: "short-text",
	lengthType: "characters",
	minLength: "",
	maxLength: "",
	placeholder: "",
	regex: "",
	regexMethod: "contains",
	required: "false",
	title: "",
	type: "text-input"
}

export const constants = Object.freeze({
	defaultTextInputProps: TextInputPropsObj,
	defaultTitleProps: TitlePropsObj,
	debounceWait: 500,
});
