import { MultipleChoiceItemProps } from "./MultipleChoiceItemProps";

export interface MultipleChoiceProps {
	allowMultiple: boolean;
	items: MultipleChoiceItemProps[];
	required: boolean;
	title: string;
	type: "multiple-choice";
}
