import { MultipleChoiceGridItemProps } from "./MultipleChoiceGridItemProps";

export default interface MultipleChoiceGridProps {
	allowMultiple: boolean;
	columns: MultipleChoiceGridItemProps[];
	required: boolean;
	rows: MultipleChoiceGridItemProps[];
	title: string;
	type: "multiple-choice-grid";
}
