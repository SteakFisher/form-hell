import { titleConstants } from "@/constants";
import FormTitleProps from "@/interfaces/FormTitleProps";
import { MutableRefObject, RefObject, createContext } from "react";
import { DebouncedState } from "use-debounce";
import { FormItem } from "formhell-js";

interface FormBuilderContextInterface {
	debounceRefs: Map<string, Map<string, DebouncedState<() => void>>>;
	firstRenderRef: RefObject<boolean>;
	focusedItemRef: MutableRefObject<{
		id: string;
		blurItem: (focusingItemId: string) => void;
	}>;
	formBuilderRef: RefObject<HTMLDivElement>;
	formItems: FormItem[];
	formTitle: string;
	formTitleObjRef: MutableRefObject<FormTitleProps>;
	heightDiffRef: MutableRefObject<{
		heightDiff: number;
		shouldScroll: boolean;
	}>;
	isSavingRef: MutableRefObject<boolean>;
	keyPrefixRef: MutableRefObject<string>;
	setFormItems: (formItems: FormItem[]) => void;
	setFormTitle: (formTitle: string) => void;
}

export const FormBuilderContext = createContext<FormBuilderContextInterface>({
	debounceRefs: new Map(),
	firstRenderRef: { current: true },
	focusedItemRef: { current: { id: "", blurItem: () => {} } },
	formBuilderRef: { current: null },
	formItems: [],
	formTitle: "",
	formTitleObjRef: { current: titleConstants.defaultProps },
	heightDiffRef: { current: { heightDiff: 0, shouldScroll: false } },
	isSavingRef: { current: false },
	keyPrefixRef: { current: "" },
	setFormItems: () => {},
	setFormTitle: () => {},
});
