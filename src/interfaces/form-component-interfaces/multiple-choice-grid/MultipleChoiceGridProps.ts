import { MultipleChoiceGridItemProps } from "./MultipleChoiceGridItemProps";

type MultipleChoiceGridProps = {
	allowMultiple: boolean;
	columns: MultipleChoiceGridItemProps[];
	required: boolean;
	rows: MultipleChoiceGridItemProps[];
	title: string;
	type: "multiple-choice-grid";
};

export default MultipleChoiceGridProps;
