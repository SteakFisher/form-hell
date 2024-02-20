import TextInputProps from "./form-component-interfaces/TextInputProps";
import TitleProps from "./form-component-interfaces/TitleProps";

export default interface FormItem {
	id: number;
	props: TextInputProps | TitleProps;
}
