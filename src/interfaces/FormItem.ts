import { FormItemMediaProps } from "./FormItemMediaProps";
import { propsTypes } from "./propsTypes";

export default interface FormItem {
	id: string;
	props: propsTypes;
	mediaProps: FormItemMediaProps;
}
