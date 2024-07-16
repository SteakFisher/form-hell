import DeleteIcon from "@/../public/icons/delete.svg";
import EditIcon from "@/../public/icons/edit.svg";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { constants } from "@/constants";
import { cn } from "@/lib/utils";
import { formAccessProps } from "@/types/Settings";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { CheckIcon, XIcon } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import IconButton from "../IconButton";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select } from "../ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";

type FormAccessTableProps = {
	formAccessMap: formAccessProps;
};

export default function FormAccessTable({
	formAccessMap: faMap,
}: FormAccessTableProps) {
	const [faDataState, setFaDataState] = useState(faMap);
	const [selectAll, setSelectAll] = useState(false);
	const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
	const [tooltipOpen, setTooltipOpen] = useState(false);

	const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const selectEmail = (email: string) => {
		if (selectedEmails.has(email)) return;

		selectedEmails.add(email);
		setSelectedEmails(new Set(selectedEmails));
	};
	const unselectEmail = (email: string) => {
		if (!selectedEmails.has(email)) return;

		selectedEmails.delete(email);
		setSelectedEmails(new Set(selectedEmails));
		setSelectAll(false);
	};

	useEffect(() => {
		selectAll
			? setSelectedEmails(new Set(faDataState.keys()))
			: setSelectedEmails(new Set());
	}, [selectAll]);

	return (
		<div className="flex w-full flex-col">
			<span>Manage form access</span>
			<div className="mt-5 flex flex-col items-center justify-center">
				<div className="flex flex-col items-center">
					<div className="w-[80%] min-w-[440px] overflow-hidden rounded-md border border-accent">
						<Table className="table-fixed">
							<TableHeader>
								<TableRow disableHover>
									<TableHead className="w-[9%]">
										<div className="flex size-full items-center justify-center">
											<Checkbox
												checked={selectAll}
												onCheckedChange={(checked) => {
													checked
														? setSelectAll(true)
														: setSelectAll(false);
												}}
											/>
										</div>
									</TableHead>
									<TableHead className="w-[50%] pl-0 text-white/50">
										Email
									</TableHead>
									{/* pr for icon positioned absolutely */}
									<TableHead className="relative flex items-center justify-center pr-[1.25rem] text-center text-white/50">
										<div className="flex items-center justify-center">
											<span className="text-center">
												Permissions
											</span>
											<Popover
												open={tooltipOpen}
												onOpenChange={setTooltipOpen}
											>
												<div
													onMouseEnter={handleMouseEnter}
													onMouseLeave={handleMouseLeave}
													className="flex items-center"
												>
													<PopoverTrigger
														className="absolute ml-1"
														onClick={(e) => e.preventDefault()}
													>
														<InfoCircledIcon className="size-4 transition-opacity duration-200 hover:opacity-65" />
													</PopoverTrigger>
												</div>
												<PopoverContent
													onMouseEnter={() => {
														if (!closeTimeoutRef.current) return;
														clearTimeout(closeTimeoutRef.current);
													}}
													onMouseLeave={handleMouseLeave}
													className="w-auto border border-black bg-accent p-2 text-sm text-white"
													side="top"
													sideOffset={6}
												>
													<p className="whitespace-pre">
														{`Read: View form responses\nWrite: View and edit form and responses`}
													</p>
												</PopoverContent>
											</Popover>
										</div>
									</TableHead>
									<TableHead className="w-[15%]" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{Array.from(faDataState).map((faEntry, index) => (
									<FATableRow
										deleteRow={deleteRow}
										editRow={editRow}
										faEntry={faEntry}
										key={index}
										selected={selectedEmails.has(faEntry[0])}
										selectEmail={selectEmail}
										unselectEmail={unselectEmail}
									/>
								))}
								<FATableAddRow
									faMap={faDataState}
									setFaDataState={setFaDataState}
								/>
							</TableBody>
						</Table>
					</div>
					<div className="flex w-[80%]">
						{/* check if user is owner */}
						<Button className="mt-2 w-min" variant="secondary">
							Transfer ownership
						</Button>
					</div>
				</div>
			</div>
		</div>
	);

	function editRow(email: string, permission: "read" | "write" | "owner") {
		faMap = faMap.set(email, permission);
		setFaDataState(new Map(faMap));
	}

	function deleteRow(email: string) {
		faMap.delete(email);
		setFaDataState(new Map(faMap));
		if (selectedEmails.has(email)) {
			selectedEmails.delete(email);
			setSelectedEmails(new Set(selectedEmails));
		}
	}

	function handleMouseEnter() {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
		}
		openTimeoutRef.current = setTimeout(() => {
			setTooltipOpen(true);
		}, 150);
	}

	function handleMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
		if (!openTimeoutRef.current) return;
		clearTimeout(openTimeoutRef.current);
		closeTimeoutRef.current = setTimeout(() => {
			setTooltipOpen(false);
		}, 150);
	}
}

function FATableRow({
	deleteRow,
	editRow,
	faEntry,
	selected,
	selectEmail,
	unselectEmail,
}: {
	deleteRow: (email: string) => void;
	editRow: (email: string, permission: "read" | "write" | "owner") => void;
	faEntry: [string, "read" | "write" | "owner"];
	selected: boolean;
	selectEmail: (email: string) => void;
	unselectEmail: (email: string) => void;
}) {
	const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const selectedPermissionRef = useRef<"read" | "write">(
		faEntry[1] === "read" ? "read" : "write",
	);

	const [editMode, setEditMode] = useState(false);
	const [tooltipOpen, setTooltipOpen] = useState(false);

	useEffect(() => {
		if (!editMode) {
			if (faEntry[1] === "owner") return;
			selectedPermissionRef.current = faEntry[1];
		}
	}, [editMode]);

	return (
		<TableRow
			className={cn("h-10", selected && "bg-muted")}
			disableHover={selected}
		>
			<TableCell className="w-[5%]">
				<div className="flex size-full items-center justify-center">
					<Checkbox
						checked={selected}
						onCheckedChange={(value) => {
							value
								? selectEmail(faEntry[0])
								: unselectEmail(faEntry[0]);
						}}
					/>
				</div>
			</TableCell>
			<TableCell className="pl-0">
				<div className="flex items-center justify-start">
					<TooltipProvider>
						<Tooltip delayDuration={200} open={tooltipOpen}>
							<TooltipTrigger
								onMouseEnter={(e) => {
									const target = e.target as HTMLElement;
									if (target.scrollWidth === target.clientWidth)
										return;
									openTimeoutRef.current = setTimeout(() => {
										setTooltipOpen(true);
									}, 500);
								}}
								onMouseLeave={() => {
									if (!openTimeoutRef.current) return;
									clearTimeout(openTimeoutRef.current);
									setTooltipOpen(false);
								}}
								onPointerDown={(e) => e.preventDefault()}
								asChild
							>
								<span className="truncate">{faEntry[0]}</span>
							</TooltipTrigger>
							<TooltipContent
								onPointerDownOutside={(e) => e.preventDefault()}
								side="bottom"
							>
								{faEntry[0]}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					{faEntry[1] === "owner" && (
						<Badge className="ml-2 hover:bg-primary">Owner</Badge>
					)}
				</div>
			</TableCell>
			<TableCell className="py-0">
				<div className="flex items-center justify-center">
					{editMode ? (
						<Select
							onValueChange={(value) => {
								if (value === "read" || value === "write") {
									selectedPermissionRef.current = value;
								}
							}}
							defaultValue={selectedPermissionRef.current}
						>
							<SelectTrigger
								centerText
								className="h-7 max-w-32 border border-ring"
							>
								<SelectValue className="text-center" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="read">Read</SelectItem>
								<SelectItem value="write">Read & Write</SelectItem>
							</SelectContent>
						</Select>
					) : (
						<>{faEntry[1] === "read" ? "Read" : "Read & Write"}</>
					)}
				</div>
			</TableCell>
			<TableCell className="py-0">
				{faEntry[1] === "owner" || (
					<div className="flex justify-end space-x-1">
						{editMode ? (
							<>
								<IconButton
									className="size-7"
									desc="Cancel"
									key="cancel-btn"
									onClick={() => {
										setEditMode(false);
									}}
								>
									<XIcon />
								</IconButton>
								<IconButton
									className="size-7"
									desc="Save"
									onClick={handleSaveClick}
								>
									<CheckIcon />
								</IconButton>
							</>
						) : (
							<>
								<IconButton
									className="size-7"
									desc="Edit"
									key="edit-btn"
									onClick={() => setEditMode(true)}
								>
									<EditIcon className="fill-white p-0.5" />
								</IconButton>
								<IconButton
									className="size-7"
									desc="Delete"
									onClick={() => deleteRow(faEntry[0])}
								>
									<DeleteIcon className="fill-white p-0.5" />
								</IconButton>
							</>
						)}
					</div>
				)}
			</TableCell>
		</TableRow>
	);

	function handleSaveClick() {
		editRow(faEntry[0], selectedPermissionRef.current);
		setEditMode(false);
	}
}

function FATableAddRow({
	faMap,
	setFaDataState,
}: {
	faMap: formAccessProps;
	setFaDataState: React.Dispatch<React.SetStateAction<formAccessProps>>;
}) {
	const EmailRef = useRef("");
	const selectedPermissionRef = useRef<"read" | "write">("read");

	const [emailError, setEmailError] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		EmailRef.current = e.target.value;
		setEmailError("");
	};

	useEffect(() => {
		if (!dialogOpen) {
			EmailRef.current = "";
			setEmailError("");
			selectedPermissionRef.current = "read";
		}
	}, [dialogOpen]);

	return (
		<TableRow className="h-10" disableHover>
			<TableCell className="py-[0.3rem]" colSpan={2}>
				<AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<AlertDialogTrigger asChild>
						<Button className="h-7" variant="ghost" size="sm">
							Add user
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent className="gap-0">
						<AlertDialogHeader>
							<AlertDialogTitle>Add collaborator</AlertDialogTitle>
							<div className="flex items-center space-x-4">
								<Input
									onChange={handleEmailChange}
									placeholder="Enter email"
								/>
								<div className="flex items-center">
									<Label className="mr-1" htmlFor="permission">
										Permission:
									</Label>
									<Select
										onValueChange={(value) => {
											if (value === "read" || value === "write") {
												selectedPermissionRef.current = value;
											}
										}}
										defaultValue="read"
									>
										<SelectTrigger
											className="min-w-32"
											id="permission"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="read">Read</SelectItem>
											<SelectItem value="write">
												Read & Write
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="error">{emailError}</div>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={handleAddClick}>
								Add
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</TableCell>
		</TableRow>
	);

	function handleAddClick(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();

		if (!constants.emailRegex.test(EmailRef.current)) {
			setEmailError("Invalid email");
			return;
		}
		if (faMap.has(EmailRef.current)) {
			setEmailError("User already exists");
			return;
		}

		faMap.set(EmailRef.current, selectedPermissionRef.current);
		setFaDataState(new Map(faMap));
		setDialogOpen(false);
	}
}
