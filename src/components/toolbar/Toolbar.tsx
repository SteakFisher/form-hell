"use client";

import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import CrossIcon from "../../../public/icons/cross.svg";
import SaveIcon from "../../../public/icons/save.svg";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import ToolbarButton from "./ToolbarButton";

const Toolbar = () => {
	const {
		debounceRefs,
		focusedItemRef,
		formBuilderRef,
		formItems,
		isSavingRef,
		setFormItems,
	} = useContext(FormBuilderContext);
	const router = useRouter();

	return (
		<div className="fixed right-3 top-1/2 -translate-y-1/2 transform space-y-2 rounded border-2 bg-black p-2 shadow-md">
			<AlertDialog>
				<AlertDialogTrigger>
					<ToolbarButton className="items-center justify-center">
						<div className="size-11 fill-white opacity-80">
							<CrossIcon className="size-full" />
						</div>
					</ToolbarButton>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Clear Form</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. Are you sure you want to
							proceed?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleClearClick}>
							Clear
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<ToolbarButton
				onBtnClick={handleSaveClick}
				className="items-center justify-center"
			>
				<div className="size-10 fill-white opacity-80">
					<SaveIcon />
				</div>
			</ToolbarButton>
		</div>
	);

	function handleClearClick() {
		setFormItems(constants.defaultFormItems);
	}

	function handleSaveClick() {
		isSavingRef.current = true;
		const errorElement = formBuilderRef.current?.querySelector(
			'[data-error="true"]',
		);
		if (errorElement) {
			const errorHTMLElement = errorElement as HTMLElement;
			const rect = errorHTMLElement.getBoundingClientRect();
			if (rect.top < 0 || rect.bottom > window.innerHeight) {
				// extra scroll fixes scrollintoview issues idk why
				requestAnimationFrame(() => {
					window.scrollBy({ top: -30, behavior: "instant" });
				});
				requestAnimationFrame(() =>
					errorHTMLElement.scrollIntoView({
						behavior: "smooth",
						block: "center",
					}),
				);
			}
			errorHTMLElement.focus({ preventScroll: true });
			return;
		}

		debounceRefs.get(focusedItemRef.current.id)?.forEach((ref) => {
			ref.flush();
		});

		localStorage.setItem("formItems", JSON.stringify(formItems));
		isSavingRef.current = false;
		router.push("../../new-form/save");
	}
};

export default Toolbar;
