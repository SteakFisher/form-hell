import { DropdownItemProps } from "./DropdownItemProps";

export type DropdownProps = {
	items: DropdownItemProps[];
	required: boolean;
	title: string;
	type: "dropdown";
};
