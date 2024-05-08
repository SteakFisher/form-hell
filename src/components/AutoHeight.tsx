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

	const calcHeightToRemove = useCallback(
		function calcHeightToRemove(): number {
			if (!accordionContentRef?.current) return 0;
			return isFocused
				? accordionOpen
					? 0
					: accordionContentRef.current.scrollHeight
				: 0;
		},
		[accordionContentRef, accordionOpen, isFocused],
	);

	const autoScroll = useCallback(
		function autoScroll(newHeight: number) {
			const focusedElement = sortableItemRef.current;
			if (focusedElement == null) return;
			const rect = focusedElement.getBoundingClientRect();
			const newBottom = rect.top + newHeight;
			const isVisible =
				rect.top >= 0 &&
				newBottom <=
					(window.innerHeight || document.documentElement.clientHeight);
			if (!isVisible) {
				const verticalPadding = 60;
				const scrollTopPx =
					rect.top < 0
						? rect.top - verticalPadding
						: newBottom - window.innerHeight + verticalPadding;

				window.scrollBy({ left: 0, top: scrollTopPx, behavior: "smooth" });
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
		const newHeight = element.clientHeight - calcHeightToRemove();
		setHeight(newHeight);

		if (autoScrollFlagRef.current) {
			autoScroll(newHeight);
		}

		const resizeObserver = new ResizeObserver(() => {
			setHeight(newHeight);
		});

		resizeObserver.observe(element);

		return () => resizeObserver.disconnect();
	}, [calcHeightToRemove, autoScroll]);

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
};

export default AutoHeight;
