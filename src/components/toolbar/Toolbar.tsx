"use client";

import { FBValidateAction } from "@/actions/FBValidateAction";
import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { FBValidate } from "@/functions/FBValidation";
import FBFormObject from "@/interfaces/FormItemsObject";
import { DownloadIcon, FileIcon } from "lucide-react";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { v4 as uuid } from "uuid";
import CopyIcon from "../../../public/icons/copy.svg";
import CrossIcon from "../../../public/icons/cross.svg";
import ExportIcon from "../../../public/icons/export.svg";
import ImportIcon from "../../../public/icons/import.svg";
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
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import ToolbarButton from "./ToolbarButton";

type ToolbarProps = {
	formId: string;
	type: "new" | "edit";
};

const Toolbar = ({ formId, type }: ToolbarProps) => {
	const savingTimeout = 750;
	const toastDuration = 2000;
	const {
		debounceRefs,
		focusedItemRef,
		formBuilderRef,
		formItems,
		isSavingRef,
		keyPrefixRef,
		setFormItems,
	} = useContext(FormBuilderContext);
	const formObject = { formId: formId, formItems: formItems };

	const fileInputRef = useRef<HTMLInputElement>(null);
	const newFormItemsRef = useRef<FBFormObject>({ formId: "", formItems: [] });
	const importJsonRef = useRef("");

	const [importOpen, setImportOpen] = useState(false);
	const [insertDialogOpen, setInsertDialogOpen] = useState(false);
	const [exportOpen, setExportOpen] = useState(false);
	const [isSavingDialogOpen, setIsSavingDialogOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleImportJsonChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			importJsonRef.current = e.target.value;
		},
		constants.debounceWait,
	);

	useEffect(() => {
		if (importOpen) {
			setSelectedFile(null);
			importJsonRef.current = "";
		}
	}, [importOpen]);

	return (
		<div className="fixed right-3 top-1/2 -translate-y-1/2 transform space-y-2 rounded border-2 bg-black p-2 shadow-md">
			<Popover open={importOpen} onOpenChange={setImportOpen}>
				<PopoverTrigger className="flex">
					<ToolbarButton
						className="items-center justify-center"
						desc="Import Form"
					>
						<div className="size-10 fill-white opacity-80">
							<ImportIcon />
						</div>
					</ToolbarButton>
				</PopoverTrigger>
				<PopoverContent align="start" className="w-auto" side="left">
					<div className="flex flex-col items-center">
						<h4 className="font-medium leading-none">Import from JSON</h4>
						<div className="mt-5 flex items-center">
							<Input
								onChange={handleImportJsonChange}
								placeholder="Paste JSON here..."
							/>
							<Button
								className="ml-2 flex items-center justify-center"
								onClick={() => {
									handleImportJsonChange.flush();
									validateAndInsertForm(importJsonRef.current);
								}}
								variant="secondary"
							>
								Insert
							</Button>
						</div>
						<span className="my-2">or</span>
						<div
							className="flex w-full items-center"
							onDragEnter={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
							onDragOver={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
							onDrop={handleDrop}
						>
							<input
								accept="application/json"
								className="hidden"
								id="import-file-upload"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (!file) return;
									setSelectedFile(file);
								}}
								ref={fileInputRef}
								type="file"
							/>
							<div className="flex w-full flex-col items-center justify-center rounded-md p-2 text-sm outline outline-1 outline-ring">
								<div className="my-2 flex flex-col items-center rounded-lg p-2 outline-dashed outline-2 outline-ring">
									<FileIcon className="size-14" />
									<span className="max-w-[6.45rem] truncate">
										{selectedFile?.name || "No file selected"}
									</span>
								</div>
								<div className="flex items-center">
									<Button
										className="mr-2 h-6 p-0 underline"
										onClick={() => fileInputRef.current?.click()}
										variant="link"
									>
										Select a File
									</Button>
									or drop it here
								</div>
								<Button
									className="mt-5 flex items-center justify-center"
									onClick={handleFileInsertClick}
									variant="secondary"
								>
									Insert
								</Button>
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
			<AlertDialog
				open={insertDialogOpen}
				onOpenChange={setInsertDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Insert Form</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. Are you sure you want to
							proceed?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={insertForm}>
							Insert
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Popover open={exportOpen} onOpenChange={setExportOpen}>
				<PopoverTrigger className="flex">
					<ToolbarButton
						className="items-center justify-center"
						desc="Export Form"
					>
						<div className="size-10 fill-white opacity-80">
							<ExportIcon />
						</div>
					</ToolbarButton>
				</PopoverTrigger>
				<PopoverContent align="start" className="w-auto" side="left">
					<div className="flex flex-col items-center">
						<h4 className="font-medium leading-none">Export as JSON</h4>
						<Button
							className="mt-5 flex items-center justify-center"
							onClick={handleCopyClick}
							variant="secondary"
						>
							<div className="mr-1 size-[0.8rem] fill-white">
								<CopyIcon />
							</div>
							Copy
						</Button>
						<Button
							className="mt-2 flex items-center justify-center"
							onClick={handleDownloadClick}
							variant="secondary"
						>
							<DownloadIcon className="mr-1 size-4" />
							Download
						</Button>
					</div>
				</PopoverContent>
			</Popover>

			<AlertDialog>
				<AlertDialogTrigger>
					<ToolbarButton
						className="items-center justify-center"
						desc="Clear Form"
					>
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
						className="items-center justify-center"
						desc="Save Form"
						onBtnClick={handleSaveClick}
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
		toast.success("Form cleared");
	}

	async function handleCopyClick() {
		const errorObj = await FBValidate(formObject);
		if (errorObj.message) {
			if (errorObj.id === "0") {
				toast.error(errorObj.message, {
					duration: 2500,
				});
			}
			const errorElement = formBuilderRef.current?.querySelector(
				`#${CSS.escape(errorObj.id)}`,
			);
			if (errorElement) {
				focusAndScrollToElement(errorElement, setIsSavingDialogOpen);
				toast.error(errorObj.message, {
					duration: 2500,
				});
			}
			return;
		}
		setExportOpen(false);
		navigator.clipboard
			.writeText(JSON.stringify(formItems))
			.catch(() => {
				toast.error("Error copying JSON", {
					duration: toastDuration,
				});
			})
			.then(() => {
				toast.success("Form JSON copied to clipboard", {
					duration: toastDuration,
				});
			});
	}

	async function handleDownloadClick() {
		const errorObj = await FBValidate(formObject);
		if (errorObj.message) {
			if (errorObj.id === "0") {
				toast.error(errorObj.message, {
					duration: 2500,
				});
			}
			const errorElement = formBuilderRef.current?.querySelector(
				`#${CSS.escape(errorObj.id)}`,
			);
			if (errorElement) {
				focusAndScrollToElement(errorElement, setIsSavingDialogOpen);
				toast.error(errorObj.message, {
					duration: 2500,
				});
			}
			return;
		}
		setExportOpen(false);
		DownloadJSON(JSON.stringify(formItems));
	}

	function handleDrop(e: React.DragEvent<HTMLDivElement>) {
		e.preventDefault();
		const files = e.dataTransfer.files;
		if (files && files.length > 0) {
			const file = files[0];
			setSelectedFile(file);
		}
	}

	function handleFileInsertClick() {
		if (!selectedFile) {
			toast.error("Please select a file", {
				duration: toastDuration,
			});
			return;
		}

		if (selectedFile.type !== "application/json") {
			toast.error("Invalid file type", {
				duration: toastDuration,
			});
		}

		const fr = new FileReader();
		fr.onload = (e) => {
			if (typeof fr.result === "string") {
				validateAndInsertForm(fr.result);
			} else {
				toast.error("Error while reading file", {
					duration: toastDuration,
				});
			}
		};
		fr.readAsText(selectedFile);
	}

	async function handleSaveClick() {
		setIsSavingDialogOpen(true);
		const timeoutStart = Date.now();
		isSavingRef.current = true;
		debounceRefs.get(focusedItemRef.current.id)?.forEach((ref) => {
			ref.flush();
		});

		const errorElement = formBuilderRef.current?.querySelector(
			'[data-error="true"]',
		);
		if (errorElement) {
			setTimeout(
				() => {
					focusAndScrollToElement(errorElement, setIsSavingDialogOpen);
					toast.error("Please fix all errors before submitting", {
						duration: toastDuration,
					});
				},
				Math.max(savingTimeout - (Date.now() - timeoutStart), 0),
			);
			return;
		}

		const errorObj = await FBValidateAction(formObject, type);
		if (errorObj.message) {
			if (errorObj.id === "0") {
				setTimeout(
					() => {
						toast.error(errorObj.message, {
							duration: 2500,
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
						focusAndScrollToElement(errorElement, setIsSavingDialogOpen);
						toast.error(errorObj.message, {
							duration: 2500,
						});
					},
					Math.max(savingTimeout - (Date.now() - timeoutStart), 0),
				);
			}
			return;
		}

		if (type === "edit") {
			isSavingRef.current = false;
			setTimeout(
				() => {
					setIsSavingDialogOpen(false);
					toast.success("Form saved successfully!", {
						duration: toastDuration,
					});
				},
				Math.max(savingTimeout - (Date.now() - timeoutStart), 0),
			);
		}
	}

	function insertForm() {
		keyPrefixRef.current = uuid();
		setFormItems([...newFormItemsRef.current.formItems]);
		document.getElementById("0")?.focus();
		setImportOpen(false);
	}

	async function validateAndInsertForm(jsonString: string) {
		try {
			const newFormObject: FBFormObject = {
				formId: formId,
				formItems: JSON.parse(jsonString),
			};
			const errorObj = await FBValidate(newFormObject);
			if (errorObj.message) {
				toast.error("Invalid JSON", {
					duration: toastDuration,
				});
				return;
			}
			newFormItemsRef.current = newFormObject;
			setInsertDialogOpen(true);
		} catch (error) {
			toast.error("Invalid JSON", {
				duration: toastDuration,
			});
		}
	}
};

function DownloadJSON(jsonString: string) {
	const blob = new Blob([jsonString], {
		type: "application/json",
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "form.json";
	a.click();
	URL.revokeObjectURL(url);
}

function focusAndScrollToElement(
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
