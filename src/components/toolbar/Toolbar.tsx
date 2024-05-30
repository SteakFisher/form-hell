"use client";

import { FBValidateForm } from "@/actions/FBValidation";
import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { useContext, useState } from "react";
import { toast } from "sonner";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import ToolbarButton from "./ToolbarButton";

const Toolbar = () => {
	const savingTimeout = 750;
	const {
		debounceRefs,
		focusedItemRef,
		formBuilderRef,
		formItems,
		isSavingRef,
		setFormItems,
	} = useContext(FormBuilderContext);
	// const router = useRouter();

	const [isSavingDialogOpen, setIsSavingDialogOpen] = useState(false);

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

			<Dialog open={isSavingDialogOpen}>
				<DialogTrigger className="flex">
					<ToolbarButton
						onBtnClick={handleSaveClick}
						className="items-center justify-center"
					>
						<div className="size-10 fill-white opacity-80">
							<SaveIcon />
						</div>
					</ToolbarButton>
				</DialogTrigger>
				<DialogContent hideClose={true}>
					<DialogHeader>
						<DialogTitle>Saving...</DialogTitle>
						<DialogDescription>
							Please do not close this page.
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);

	function handleClearClick() {
		setFormItems(constants.defaultFormItems);
	}

	function handleSaveClick() {
		toast.dismiss("fb-submit-toast");
		setIsSavingDialogOpen(true);
		const timeoutStart = Date.now();
		isSavingRef.current = true;
		const errorElement = formBuilderRef.current?.querySelector(
			'[data-error="true"]',
		);
		if (errorElement) {
			setTimeout(
				() => {
					focusErrorElement(errorElement, setIsSavingDialogOpen);
					toast.error("Fix all errors before submitting", {
						duration: 2000,
						id: "fb-submit-toast",
					});
				},
				Math.max(savingTimeout - (Date.now() - timeoutStart), 0),
			);
			return;
		}

		FBValidateForm(formItems).then((errorObj) => {
			if (errorObj.message) {
				if (errorObj.id === "0") {
					setTimeout(
						() => {
							toast.error(errorObj.message, {
								duration: 2500,
								id: "fb-submit-toast",
							});
							setIsSavingDialogOpen(false);
						},
						Math.max(savingTimeout - (Date.now() - timeoutStart), 0),
					);
				}
				const errorElement = formBuilderRef.current?.querySelector(
					`#${CSS.escape(errorObj.id)}`,
				);
				if (errorElement) {
					setTimeout(
						() => {
							focusErrorElement(errorElement, setIsSavingDialogOpen);
							toast.error(errorObj.message, {
								duration: 2500,
								id: "fb-submit-toast",
							});
						},
						Math.max(savingTimeout - (Date.now() - timeoutStart), 0),
					);
				}
				return;
			}
			debounceRefs.get(focusedItemRef.current.id)?.forEach((ref) => {
				ref.flush();
			});
			isSavingRef.current = false;
			setTimeout(
				() => {
					setIsSavingDialogOpen(false);
					toast.success("Form saved successfully!", {
						duration: 2000,
						id: "fb-submit-toast",
					});
				},
				Math.max(savingTimeout - (Date.now() - timeoutStart), 0),
			);
			// localStorage.setItem("formItems", JSON.stringify(formItems));
			// router.push("../../new-form/save");
		});
	}
};

function focusErrorElement(
	errorElement: Element,
	setIsSavingDialogOpen: (value: boolean) => void,
) {
	const errorHTMLElement = errorElement as HTMLElement;
	const rect = errorHTMLElement.getBoundingClientRect();
	setIsSavingDialogOpen(false);
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
}

export default Toolbar;
