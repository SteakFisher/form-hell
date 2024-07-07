import DateProps from "./form-component-interfaces/DateProps";
import { DropdownProps } from "./form-component-interfaces/dropdown/DropdownProps";
import MediaProps from "./form-component-interfaces/MediaProps";
import MultipleChoiceGridProps from "./form-component-interfaces/multiple-choice-grid/MultipleChoiceGridProps";
import { MultipleChoiceProps } from "./form-component-interfaces/multiple-choice/MultipleChoiceProps";
import { RangeProps } from "./form-component-interfaces/RangeProps";
import TextInputProps from "./form-component-interfaces/TextInputProps";

export type propsTypes =
	| DateProps
	| DropdownProps
	| MediaProps
	| MultipleChoiceProps
	| MultipleChoiceGridProps
	| RangeProps
	| TextInputProps;
