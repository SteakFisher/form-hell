import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FormTitleProps } from "formhell-js";

export default function TitleComponent({ props }: { props: FormTitleProps }) {
	return (
		<CardHeader className={"flex items-center justify-center"}>
			<CardTitle>{props.title}</CardTitle>
			<CardDescription>{props.description}</CardDescription>
		</CardHeader>
	);
}
