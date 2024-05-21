import { MutableRefObject, RefObject, createContext } from "react";

interface SortableItemContextInterface {
	mediaUrlState: string;
	mediaVideoIdRef: MutableRefObject<string>;
	setMediaUrlState: (value: string) => void;
	sortableItemRef: RefObject<HTMLDivElement>;
}

export const SortableItemContext = createContext<SortableItemContextInterface>({
	mediaUrlState: "",
	mediaVideoIdRef: { current: "" },
	setMediaUrlState: () => {},
	sortableItemRef: { current: null },
});
