import { ChangeEvent, MutableRefObject, createContext } from "react";
import { DebouncedState } from "use-debounce";
import FormItem from "../interfaces/FormItem";

interface FormBuilderContextInterface {
	debounceRefs: Map<string, Map<string, DebouncedState<() => void>>>;
	focusedIdRef: MutableRefObject<string>;
	formItems: FormItem[];
	setFormItems: (formItems: FormItem[]) => void;
}

export const FormBuilderContext = createContext<FormBuilderContextInterface>({
	debounceRefs: new Map(),
	focusedIdRef: { current: "" },
	formItems: [],
	setFormItems: () => {},
});
