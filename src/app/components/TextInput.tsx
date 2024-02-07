import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SortableItem } from "./SortableItem";

interface TextInputProps {
	id: number;
	placeholder: string;
}

export function TextInput({ id, placeholder }: TextInputProps) {
	return (
		<SortableItem id={id} title="Text Input">
			<CardContent>
				<Input type="text" placeholder={placeholder} />
			</CardContent>
		</SortableItem>
	);
}
