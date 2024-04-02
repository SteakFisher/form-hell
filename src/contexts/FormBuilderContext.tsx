import { ChangeEvent, MutableRefObject, createContext } from "react";
import { DebouncedState } from "use-debounce";
import FormItem from "../interfaces/FormItem";

interface FormBuilderContextInterface {
	addId: string;
	debounceRefs: Map<string, Map<string, DebouncedState<() => void>>>;
	focusedIdRef: MutableRefObject<string>;
	formItems: FormItem[];
	setAddId: (addId: string) => void;
	setFormItems: (formItems: FormItem[]) => void;
}

export const FormBuilderContext = createContext<FormBuilderContextInterface>({
	addId: "",
	debounceRefs: new Map(),
	focusedIdRef: { current: "" },
	formItems: [],
	setAddId: () => {},
	setFormItems: () => {},
});
