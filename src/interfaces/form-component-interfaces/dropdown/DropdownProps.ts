import { DropdownItemProps } from "./DropdownItemProps";

export interface DropdownProps {
	items: DropdownItemProps[];
	required: boolean;
	title: string;
	type: "dropdown";
}
