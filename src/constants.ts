import { DateProps } from "formhell-js";
import { DropdownProps } from "formhell-js";
import { MediaProps } from "formhell-js";
import { MultipleChoiceGridProps } from "formhell-js";
import { MultipleChoiceProps } from "formhell-js";
import { RangeProps } from "formhell-js";
import { TextInputProps } from "formhell-js";
import { TitleProps } from "formhell-js";
import { FormItem } from "formhell-js";

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
	regexPattern: "",
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

// --- constants objs ---

export const constants = Object.freeze({
	autoHeightDuration: 225,
	debounceWait: 500,
	defaultFormItems: defaultFormItems,
	formItemTitleMaxLength: 500,
	intRegex: /^(-)?((0+)|[1-9]\d*)$/,
});

export const dateConstants = Object.freeze({
	defaultProps: DatePropsObj,
});

export const titleConstants = Object.freeze({
	defaultProps: TitlePropsObj,
	formTitleMaxLength: 250,
	formDescMaxLength: 750,
});

export const dropdownConstants = Object.freeze({
	defaultProps: DropdownPropsObj,
	itemMaxLength: 300,
	maxItems: 10,
});

export const mediaConstants = Object.freeze({
	defaultProps: MediaPropsObj,
	altTextMaxLength: 300,
});

export const multipleChoiceConstants = Object.freeze({
	defaultProps: MultipleChoicePropsObj,
	itemMaxLength: 300,
	maxItems: 10,
});

export const MCGridConstants = Object.freeze({
	defaultProps: MultipleChoiceGridPropsObj,
	itemMaxLength: 300,
	maxItems: 10,
});

export const rangeConstants = Object.freeze({
	defaultProps: RangePropsObj,
	maxStepCount: 50,
});

export const textInputConstants = Object.freeze({
	defaultProps: TextInputPropsObj,
	lengthsMin: 0,
	lengthsMax: 99999,
	regexPatternMaxLength: 1000,
	regexFlagsMaxLength: 8,
});
