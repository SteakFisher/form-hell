import { DropdownProps } from "./form-component-interfaces/dropdown/DropdownProps";
import { MultipleChoiceProps } from "./form-component-interfaces/multiple-choice/MultipleChoiceProps";
import { RangeProps } from "./form-component-interfaces/RangeProps";
import TextInputProps from "./form-component-interfaces/TextInputProps";
import TitleProps from "./form-component-interfaces/TitleProps";
import MultipleChoiceGridProps from "./form-component-interfaces/multiple-choice-grid/MultipleChoiceGridProps";

export type propsTypes =
	| DropdownProps
	| TextInputProps
	| TitleProps
	| MultipleChoiceProps
	| MultipleChoiceGridProps
	| RangeProps;
