export interface MultipleChoiceItemProps {
	id: number;
	other?: boolean;
	parentId: number;
	value?: string;
	onDelete: (idToDelete: number) => void;
}
