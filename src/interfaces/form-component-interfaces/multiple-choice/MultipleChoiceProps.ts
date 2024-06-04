import { MultipleChoiceItemProps } from "./MultipleChoiceItemProps";

export type MultipleChoiceProps = {
	allowMultiple: boolean;
	hasOther: boolean;
	items: MultipleChoiceItemProps[];
	required: boolean;
	title: string;
	type: "multiple-choice";
};
