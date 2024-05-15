import { constants } from "@/constants";
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
	autoHeightChildRef: RefObject<HTMLDivElement>;
	children: React.ReactNode;
	deleteClicked: boolean;
	deleteItem: () => void;
	isFocused: boolean;
	sortableItemRef: RefObject<HTMLDivElement>;
}

const AutoHeight = ({
	autoHeightChildRef,
	children,
	deleteClicked,
	deleteItem,
	isFocused,
	sortableItemRef,
	...props
}: AutoHeightProps) => {
	const { firstRenderRef, heightDiffRef } = useContext(FormBuilderContext);

	const [duration, setDuration] = useState<number>(
		constants.autoHeightDuration,
	);
	const [height, setHeight] = useState<Height>(0);

	useEffect(() => {
		if (!firstRenderRef.current) {
			setDuration(constants.autoHeightDuration);
			setHeight(0);
		}
	}, [deleteClicked, firstRenderRef]);

	const isFocusingRef = useRef<boolean>(false);

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
					const heightDiff = heightDiffRef.current.shouldScroll
						? heightDiffRef.current.heightDiff
						: 0;
					const scrollTopPx = rect.top - verticalPadding + heightDiff;
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
			isFocusingRef.current = false;
		},
		[sortableItemRef],
	);

	useEffect(() => {
		if (isFocused) {
			isFocusingRef.current = true;
		}
		setDuration(constants.autoHeightDuration);
	}, [isFocused]);

	useEffect(() => {
		const autoHeightChild = autoHeightChildRef.current as HTMLDivElement;

		if (isFocusingRef.current) {
			autoScroll(autoHeightChild.scrollHeight);
		}

		const resizeObserver = new ResizeObserver(() => {
			setHeight(autoHeightChild.scrollHeight);
		});

		resizeObserver.observe(autoHeightChild);
		return () => resizeObserver.disconnect();
	}, [autoScroll, autoHeightChildRef]);

	return (
		<AnimateHeight
			className="w-full"
			contentRef={autoHeightChildRef}
			disableDisplayNone
			duration={duration}
			height={height}
			{...props}
			onHeightAnimationEnd={handleAnimationEnd}
		>
			{children}
		</AnimateHeight>
	);

	function handleAnimationEnd(newHeight: Height) {
		if (newHeight === 0 && !firstRenderRef.current) {
			deleteItem();
		} else {
			setDuration(0);
		}
	}
};

export default AutoHeight;
