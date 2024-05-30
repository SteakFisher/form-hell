import DateProps from "./interfaces/form-component-interfaces/DateProps";
import { DropdownProps } from "./interfaces/form-component-interfaces/dropdown/DropdownProps";
import MediaProps from "./interfaces/form-component-interfaces/MediaProps";
import MultipleChoiceGridProps from "./interfaces/form-component-interfaces/multiple-choice-grid/MultipleChoiceGridProps";
import { MultipleChoiceProps } from "./interfaces/form-component-interfaces/multiple-choice/MultipleChoiceProps";
import { RangeProps } from "./interfaces/form-component-interfaces/RangeProps";
import TextInputProps from "./interfaces/form-component-interfaces/TextInputProps";
import TitleProps from "./interfaces/form-component-interfaces/TitleProps";
import FormItem from "./interfaces/FormItem";

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

const MediaPropsObj: MediaProps = {
	altText: "",
	mediaType: "image",
	required: false,
	title: "",
	type: "media",
	url: "",
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
	lengthType: "characters",
	maxLength: 0,
	minLength: 0,
	multiline: false,
	regex: "",
	regexFlags: "",
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

const defaultFormItems: FormItem[] = [
	{
		id: "0",
		mediaProps: { mediaAltText: "", mediaType: "image", mediaUrl: "" },
		props: TitlePropsObj,
	},
];

export const constants = Object.freeze({
	autoHeightDuration: 225,

	defaultDateProps: DatePropsObj,
	defaultDropdownProps: DropdownPropsObj,
	defaultFormItems: defaultFormItems,
	defaultMediaProps: MediaPropsObj,
	defaultMultipleChoiceProps: MultipleChoicePropsObj,
	defaultMultipleChoiceGridProps: MultipleChoiceGridPropsObj,
	defaultRangeProps: RangePropsObj,
	defaultTextInputProps: TextInputPropsObj,
	defaultTitleProps: TitlePropsObj,

	debounceWait: 500,
	formItemTitleMaxLength: 500,
	formTitleMaxLength: 250,
	formDescMaxLength: 750,
	intRegex: /^(-)?((0+)|[1-9]\d*)$/,
});

export const dropdownConstants = Object.freeze({
	itemMaxLength: 300,
	maxItems: 10,
});

export const mediaConstants = Object.freeze({
	altTextMaxLength: 300,
});

export const multipleChoiceConstants = Object.freeze({
	itemMaxLength: 300,
	maxItems: 10,
});

export const multipleChoiceGridConstants = Object.freeze({
	itemMaxLength: 300,
	maxItems: 10,
});

export const rangeConstants = Object.freeze({
	maxStepCount: 50,
});

export const textInputConstants = Object.freeze({
	lengthsMin: 0,
	lengthsMax: 99999,
	regexPatternMaxLength: 1000,
	regexFlagsMaxLength: 8,
});
