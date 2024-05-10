import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import React, {
	RefObject,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import AnimateHeight, { Height } from "react-animate-height";

interface AutoHeightProps {
	accordionContentRef?: RefObject<HTMLDivElement>;
	accordionOpen?: boolean;
	children: React.ReactNode;
	isFocused: boolean;
	sortableItemRef: RefObject<HTMLDivElement>;
}

const AutoHeight = ({
	accordionContentRef,
	accordionOpen,
	children,
	isFocused,
	sortableItemRef,
	...props
}: AutoHeightProps) => {
	const { heightDiffRef } = useContext(FormBuilderContext);
	const [height, setHeight] = useState<Height>("auto");

	const autoScrollFlagRef = useRef<boolean>(false);
	const contentDiv = useRef<HTMLDivElement>(null);

	const autoScroll = useCallback(
		function autoScroll(newHeight: number) {
			const focusedElement = sortableItemRef.current;
			if (focusedElement == null) return;
			const rect = focusedElement.getBoundingClientRect();
			const newBottom = rect.top + newHeight;
			const isTopVisible = rect.top >= 0;
			const isBottomVisible = newBottom <= window.innerHeight;
			const verticalPadding = 30;

			if (!isTopVisible) {
				if (isBottomVisible) {
					const scrollTopPx = rect.top - verticalPadding;
					window.scrollBy({
						left: 0,
						top: scrollTopPx,
						behavior: "smooth",
					});
				}
			} else {
				if (!isBottomVisible) {
					if (newHeight + verticalPadding < window.innerHeight) {
						const heightDiff = heightDiffRef.current.shouldScroll
							? heightDiffRef.current.heightDiff
							: 0;
						const scrollTopPx =
							newBottom -
							window.innerHeight +
							verticalPadding +
							heightDiff;
						window.scrollBy({
							left: 0,
							top: scrollTopPx,
							behavior: "smooth",
						});
					} else {
						const scrollTopPx = rect.top - verticalPadding;
						window.scrollBy({
							left: 0,
							top: scrollTopPx,
							behavior: "smooth",
						});
					}
				}
			}

			heightDiffRef.current.shouldScroll = false;
			autoScrollFlagRef.current = false;
		},
		[sortableItemRef],
	);

	useEffect(() => {
		if (isFocused) {
			autoScrollFlagRef.current = true;
		}
	}, [isFocused]);

	useEffect(() => {
		const element = contentDiv.current as HTMLDivElement;

		if (autoScrollFlagRef.current) {
			autoScroll(newHeight(element));
		}

		const resizeObserver = new ResizeObserver(() => {
			setHeight(newHeight(element));
		});

		resizeObserver.observe(element);

		return () => resizeObserver.disconnect();
	}, [isFocused, accordionOpen, autoScroll]);

	return (
		<AnimateHeight
			className="w-full"
			contentRef={contentDiv}
			disableDisplayNone
			duration={225}
			height={height}
			{...props}
		>
			{children}
		</AnimateHeight>
	);

	function newHeight(element: HTMLDivElement): number {
		if (!accordionContentRef?.current) return element.scrollHeight;
		return (
			element.scrollHeight -
			(isFocused
				? accordionOpen
					? 0
					: accordionContentRef.current.scrollHeight
				: 0)
		);
	}
};

export default AutoHeight;
