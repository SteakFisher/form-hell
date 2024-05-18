import { RefObject, createContext } from "react";

interface SortableItemContextInterface {
	sortableItemRef: RefObject<HTMLDivElement>;
}

export const SortableItemContext = createContext<SortableItemContextInterface>({
	sortableItemRef: { current: null },
});
