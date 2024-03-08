import { ChangeEvent, createContext } from "react";
import FormItem from "../interfaces/FormItem";
import { DebouncedState } from "use-debounce";

interface FormBuilderContextInterface {
	formItems: FormItem[];
	setFormItems: (formItems: FormItem[]) => void;
	debounceRefs: Map<
		string,
		DebouncedState<(e: ChangeEvent<any> | React.MouseEvent<any>) => void>
	>;
}

export const FormBuilderContext = createContext<FormBuilderContextInterface>({
	formItems: [],
	setFormItems: () => {},
	debounceRefs: new Map(),
});
