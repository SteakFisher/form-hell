import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import React, {
	RefObject,
	useCallback,
	useContext,
	useEffect,
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
	const { firstRenderRef, heightDiffRef, isSavingRef } =
		useContext(FormBuilderContext);

	const [duration, setDuration] = useState<number>(
		constants.autoHeightDuration,
	);
	const [height, setHeight] = useState<Height>(
		firstRenderRef.current ? "auto" : 0,
	);

	useEffect(() => {
		if (deleteClicked) {
			setDuration(constants.autoHeightDuration);
			setHeight(0);
		}
	}, [deleteClicked]);

	const autoScroll = useCallback(
		function autoScroll(newHeight: number) {
			const focusedElement = sortableItemRef.current;
			if (focusedElement == null) return;
			const rect = focusedElement.getBoundingClientRect();
			const newBottom = rect.top + newHeight;
			const isTopBelowStart = rect.top >= 0;
			const isBottomAboveEnd = newBottom <= window.innerHeight;
			const verticalPadding = 30;

			if (isSavingRef.current) {
				isSavingRef.current = false;
				heightDiffRef.current.shouldScroll = false;
				return;
			}
			if (!isTopBelowStart) {
				if (isBottomAboveEnd) {
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
				if (!isBottomAboveEnd) {
					const totalHeight = newHeight + verticalPadding;
					if (totalHeight < window.innerHeight) {
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
					} else if (totalHeight === window.innerHeight) {
						const scrollTopPx = rect.top;
						window.scrollBy({
							left: 0,
							top: scrollTopPx,
							behavior: "smooth",
						});
					}
				}
			}

			heightDiffRef.current.shouldScroll = false;
		},
		[heightDiffRef, isSavingRef, sortableItemRef],
	);

	useEffect(() => {
		if (isFocused) {
			const autoHeightChild = autoHeightChildRef.current as HTMLDivElement;
			autoScroll(autoHeightChild.scrollHeight);
		}
		setDuration(constants.autoHeightDuration);
	}, [autoHeightChildRef, autoScroll, isFocused]);

	useEffect(() => {
		const autoHeightChild = autoHeightChildRef.current as HTMLDivElement;

		const resizeObserver = new ResizeObserver(() => {
			setHeight(autoHeightChild.scrollHeight);
		});

		resizeObserver.observe(autoHeightChild);
		return () => resizeObserver.disconnect();
	}, [autoHeightChildRef]);

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
