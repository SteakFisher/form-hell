export interface DropdownItemProps {
	id: number;
	other?: true;
	parentId: number;
	value?: string;
	onDelete: (idToDelete: number) => void;
}
