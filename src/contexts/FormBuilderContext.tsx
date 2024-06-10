import { MutableRefObject, RefObject, createContext } from "react";
import { DebouncedState } from "use-debounce";
import FormItem from "../interfaces/FormItem";

interface FormBuilderContextInterface {
	debounceRefs: Map<string, Map<string, DebouncedState<() => void>>>;
	firstRenderRef: RefObject<boolean>;
	focusedItemRef: MutableRefObject<{ id: string; blurItem: () => void }>;
	formBuilderRef: RefObject<HTMLDivElement>;
	formItems: FormItem[];
	heightDiffRef: MutableRefObject<{
		heightDiff: number;
		shouldScroll: boolean;
	}>;
	isSavingRef: MutableRefObject<boolean>;
	keyPrefixRef: MutableRefObject<string>;
	setFormItems: (formItems: FormItem[]) => void;
}

export const FormBuilderContext = createContext<FormBuilderContextInterface>({
	debounceRefs: new Map(),
	firstRenderRef: { current: true },
	focusedItemRef: { current: { id: "", blurItem: () => {} } },
	formBuilderRef: { current: null },
	formItems: [],
	heightDiffRef: { current: { heightDiff: 0, shouldScroll: false } },
	isSavingRef: { current: false },
	keyPrefixRef: { current: "" },
	setFormItems: () => {},
});
