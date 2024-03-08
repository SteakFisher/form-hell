import TextInputProps from "./form-component-interfaces/TextInputProps";
import TitleProps from "./form-component-interfaces/TitleProps";
import { propsTypes } from "./propsTypes";

export default interface FormItem {
	id: number;
	props: propsTypes;
}
