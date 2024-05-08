import { RefObject, createContext } from "react";

interface SortableItemContextInterface {
	accordionContentRef: RefObject<HTMLDivElement>;
}

export const SortableItemContext = createContext<SortableItemContextInterface>({
	accordionContentRef: { current: null },
});
