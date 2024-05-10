import { MutableRefObject, createContext } from "react";
import { DebouncedState } from "use-debounce";
import FormItem from "../interfaces/FormItem";

interface FormBuilderContextInterface {
	debounceRefs: Map<string, Map<string, DebouncedState<() => void>>>;
	focusedItemRef: MutableRefObject<{ id: string; blurItem: () => void }>;
	formItems: FormItem[];
	heightDiffRef: MutableRefObject<{
		heightDiff: number;
		shouldScroll: boolean;
	}>;
	setFormItems: (formItems: FormItem[]) => void;
}

export const FormBuilderContext = createContext<FormBuilderContextInterface>({
	debounceRefs: new Map(),
	focusedItemRef: { current: { id: "", blurItem: () => {} } },
	formItems: [],
	heightDiffRef: { current: { heightDiff: 0, shouldScroll: false } },
	setFormItems: () => {},
});
