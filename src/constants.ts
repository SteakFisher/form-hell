import DateProps from "./interfaces/form-component-interfaces/DateProps";
import { DropdownProps } from "./interfaces/form-component-interfaces/dropdown/DropdownProps";
import MediaProps from "./interfaces/form-component-interfaces/MediaProps";
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

export const constants = Object.freeze({
	autoHeightDuration: 225,
	defaultDateProps: DatePropsObj,
	defaultDropdownProps: DropdownPropsObj,
	defaultFormItems: [{ id: "0", props: TitlePropsObj }],
	defaultMediaProps: MediaPropsObj,
	defaultMultipleChoiceProps: MultipleChoicePropsObj,
	defaultMultipleChoiceGridProps: MultipleChoiceGridPropsObj,
	defaultRangeProps: RangePropsObj,
	defaultTextInputProps: TextInputPropsObj,
	defaultTitleProps: TitlePropsObj,
	debounceWait: 500,
	intRegex: /^(-)?((0+)|[1-9]\d*)$/,
});
