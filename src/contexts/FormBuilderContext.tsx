import { FormItem } from "formhell-js";
import { MutableRefObject, RefObject, createContext } from "react";
import { DebouncedState } from "use-debounce";

interface FormBuilderContextInterface {
	debounceRefs: Map<string, Map<string, DebouncedState<() => void>>>;
	firstRenderRef: RefObject<boolean>;
	focusedItemRef: MutableRefObject<{
		id: string;
		blurItem: (focusingItemId: string) => void;
	}>;
	formBuilderRef: RefObject<HTMLDivElement>;
	formDesc: string;
	formItems: FormItem[];
	formTitle: string;
	heightDiffRef: MutableRefObject<{
		heightDiff: number;
		shouldScroll: boolean;
	}>;
	isSavingRef: MutableRefObject<boolean>;
	keyPrefixRef: MutableRefObject<string>;
	setFormDesc: (formDesc: string) => void;
	setFormItems: (formItems: FormItem[]) => void;
	setFormTitle: (formTitle: string) => void;
}

export const FormBuilderContext = createContext<FormBuilderContextInterface>({
	debounceRefs: new Map(),
	firstRenderRef: { current: true },
	focusedItemRef: { current: { id: "", blurItem: () => {} } },
	formBuilderRef: { current: null },
	formDesc: "",
	formItems: [],
	formTitle: "",
	heightDiffRef: { current: { heightDiff: 0, shouldScroll: false } },
	isSavingRef: { current: false },
	keyPrefixRef: { current: "" },
	setFormDesc: () => {},
	setFormItems: () => {},
	setFormTitle: () => {},
});
