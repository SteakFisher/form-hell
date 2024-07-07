import FormItem from "@/interfaces/FormItem";
import FormTitleProps from "./FormTitleProps";

export default interface FBFormObject {
	formId: string;
	formItems: FormItem[];
	formTitleObj: FormTitleProps;
}
