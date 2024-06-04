import { FormItemMediaProps } from "./FormItemMediaProps";
import { propsTypes } from "./propsTypes";

type FormItem = {
	id: string;
	props: propsTypes;
	mediaProps: FormItemMediaProps;
};

export default FormItem;
