import { RangeProps } from "./interfaces/form-component-interfaces/RangeProps";
import TextInputProps from "./interfaces/form-component-interfaces/TextInputProps";
import TitleProps from "./interfaces/form-component-interfaces/TitleProps";
import { DropdownProps } from "./interfaces/form-component-interfaces/dropdown/DropdownProps";
import { MultipleChoiceProps } from './interfaces/form-component-interfaces/multiple-choice/MultipleChoiceProps';

const TitlePropsObj: TitleProps = {
	description: "",
	required: false,
	title: "",
	type: "title",
	isValid: true,
};

const TextInputPropsObj: TextInputProps = {
	inputType: "short-text",
	lengthType: "characters",
	minLength: "",
	maxLength: "",
	placeholder: "",
	regex: "",
	regexMethod: "contains",
	required: false,
	title: "",
	type: "text-input"
}

const MultipleChoicePropsObj: MultipleChoiceProps = {
	allowMultiple: false,
	items: [],
	required: false,
	title: "",
	type: "multiple-choice"
}

const DropdownPropsObj: DropdownProps = {
	items: [],
	required: false,
	title: "",
	type: "dropdown"
}

const RangePropsObj: RangeProps = {
	min: "",
	max: "",
	step: "",
	required: false,
	title: "",
	type: "range"
}

export const constants = Object.freeze({
	defaultDropdownProps: DropdownPropsObj,
	defaultMultipleChoiceProps: MultipleChoicePropsObj,
	defaultRangeProps: RangePropsObj,
	defaultTextInputProps: TextInputPropsObj,
	defaultTitleProps: TitlePropsObj,
	debounceWait: 500,
});
