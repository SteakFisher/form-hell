import DateProps from "./interfaces/form-component-interfaces/DateProps";
import { DropdownProps } from "./interfaces/form-component-interfaces/dropdown/DropdownProps";
import MultipleChoiceGridProps from "./interfaces/form-component-interfaces/multiple-choice-grid/MultipleChoiceGridProps";
import { MultipleChoiceProps } from "./interfaces/form-component-interfaces/multiple-choice/MultipleChoiceProps";
import { RangeProps } from "./interfaces/form-component-interfaces/RangeProps";
import TextInputProps from "./interfaces/form-component-interfaces/TextInputProps";
import TitleProps from "./interfaces/form-component-interfaces/TitleProps";

const DatePropsObj: DateProps = {
	required: false,
	title: "",
	type: "date",
};

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
	min: 0,
	max: 1,
	step: 1,
	required: false,
	title: "",
	type: "range",
};

const TextInputPropsObj: TextInputProps = {
	inputType: "short-text",
	lengthType: "characters",
	minLength: 0,
	maxLength: 0,
	placeholder: "",
	regex: "",
	regexFlags: "m",
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
	autoHeightDuration: 225,
	defaultDateProps: DatePropsObj,
	defaultDropdownProps: DropdownPropsObj,
	defaultFormItems: [{ id: "0", props: TitlePropsObj }],
	defaultMultipleChoiceProps: MultipleChoicePropsObj,
	defaultMultipleChoiceGridProps: MultipleChoiceGridPropsObj,
	defaultRangeProps: RangePropsObj,
	defaultTextInputProps: TextInputPropsObj,
	defaultTitleProps: TitlePropsObj,
	debounceWait: 500,
	intRegex: /^(-)?((0+)|[1-9]\d*)$/,
});
