import React, {
	useRef,
	useState,
	useEffect,
	useCallback,
	RefObject,
} from "react";
import AnimateHeight, { Height } from "react-animate-height";

interface AutoHeightProps {
	accordionContentRef?: RefObject<HTMLDivElement>;
	accordionOpen?: boolean;
	children: React.ReactNode;
	isFocused?: boolean;
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

	useEffect(() => {
		const element = contentDiv.current as HTMLDivElement;

		const resizeObserver = new ResizeObserver(() => {
			setHeight(element.clientHeight - calcHeightToRemove());
		});

		resizeObserver.observe(element);

		return () => resizeObserver.disconnect();
	}, [calcHeightToRemove]);

	useEffect(() => {
		const element = contentDiv.current as HTMLDivElement;
		setHeight(element.clientHeight - calcHeightToRemove());
		sortableItemRef.current?.focus();
	}, [calcHeightToRemove, sortableItemRef]);

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
