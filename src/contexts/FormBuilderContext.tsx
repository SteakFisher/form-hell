import { ChangeEvent, MutableRefObject, createContext } from "react";
import { DebouncedState } from "use-debounce";
import FormItem from "../interfaces/FormItem";

interface FormBuilderContextInterface {
	addId: string;
	debounceRefs: Map<string, DebouncedState<() => void>>;
	focusedIndexRef: MutableRefObject<string>;
	formItems: FormItem[];
	setAddId: (addId: string) => void;
	setFormItems: (formItems: FormItem[]) => void;
}

export const FormBuilderContext = createContext<FormBuilderContextInterface>({
	addId: "",
	debounceRefs: new Map(),
	focusedIndexRef: { current: "" },
	formItems: [],
	setAddId: ()=>{},
	setFormItems: () => {},
});
