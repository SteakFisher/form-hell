import { createContext } from "react";
import FormItem from "../interfaces/FormItem";


interface FormBuilderContextInterface {
	formItems: FormItem[];
	setFormItems: (formItems: FormItem[]) => void;
}

export const FormBuilderContext = createContext<FormBuilderContextInterface>({ formItems: [], setFormItems: () => {} });
