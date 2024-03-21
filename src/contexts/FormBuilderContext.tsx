import {
	ChangeEvent,
	MutableRefObject,
	createContext
} from "react";
import { DebouncedState } from "use-debounce";
import FormItem from "../interfaces/FormItem";

interface FormBuilderContextInterface {
	formItems: FormItem[];
	setFormItems: (formItems: FormItem[]) => void;
	debounceRefs: Map<
		string,
		DebouncedState<(e: ChangeEvent<any> | React.MouseEvent<any>) => void>
	>;
	focusedIndexRef: MutableRefObject<Number>;
}

export const FormBuilderContext = createContext<FormBuilderContextInterface>({
	formItems: [],
	setFormItems: () => {},
	debounceRefs: new Map(),
	focusedIndexRef: { current: 0 },
});
