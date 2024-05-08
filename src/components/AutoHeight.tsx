import React, {
	RefObject,
	useCallback,
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
	const [height, setHeight] = useState<Height>("auto");
	const contentDiv = useRef<HTMLDivElement | null>(null);
	const autoScrollFlagRef = useRef<boolean>(false);

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
					const scrollTopPx =
						newHeight + verticalPadding < window.innerHeight
							? newBottom - window.innerHeight + verticalPadding
							: rect.top - verticalPadding;
					window.scrollBy({
						left: 0,
						top: scrollTopPx,
						behavior: "smooth",
					});
				}
			}

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
			{...props}
			className="w-full"
			height={height}
			contentRef={contentDiv}
			disableDisplayNone
			duration={250}
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
