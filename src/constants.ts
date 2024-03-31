import MultipleChoiceGridProps from "./interfaces/form-component-interfaces/multiple-choice-grid/MultipleChoiceGridProps";
import { RangeProps } from "./interfaces/form-component-interfaces/RangeProps";
import TextInputProps from "./interfaces/form-component-interfaces/TextInputProps";
import TitleProps from "./interfaces/form-component-interfaces/TitleProps";
import { DropdownProps } from "./interfaces/form-component-interfaces/dropdown/DropdownProps";
import { MultipleChoiceProps } from "./interfaces/form-component-interfaces/multiple-choice/MultipleChoiceProps";
import DateProps from "./interfaces/form-component-interfaces/DateProps";

const DatePropsObj: DateProps = {
	required: false,
	title: "",
	type: "date"
}

const DropdownPropsObj: DropdownProps = {
	items: [],
	required: false,
	title: "",
	type: "dropdown",
};

const MultipleChoicePropsObj: MultipleChoiceProps = {
	allowMultiple: false,
	hasOther: false,
	items: [],
	required: false,
	title: "",
	type: "multiple-choice",
};

const MultipleChoiceGridPropsObj: MultipleChoiceGridProps = {
	allowMultiple: false,
	columns: [],
	required: false,
	rows: [],
	title: "",
	type: "multiple-choice-grid",
};

const RangePropsObj: RangeProps = {
	min: "",
	max: "",
	step: "",
	required: false,
	title: "",
	type: "range",
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
	type: "text-input",
};

const TitlePropsObj: TitleProps = {
	description: "",
	required: false,
	title: "",
	type: "title",
};

export const constants = Object.freeze({
	defaultDateProps: DatePropsObj,
	defaultDropdownProps: DropdownPropsObj,
	defaultMultipleChoiceProps: MultipleChoicePropsObj,
	defaultMultipleChoiceGridProps: MultipleChoiceGridPropsObj,
	defaultRangeProps: RangePropsObj,
	defaultTextInputProps: TextInputPropsObj,
	defaultTitleProps: TitlePropsObj,
	debounceWait: 500,
	intRegex: /^(-)?((0+)|[1-9]\d*)?$/,
});
