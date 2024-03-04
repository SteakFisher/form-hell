import { constants } from "@/app/constants";
import { FormBuilderContext } from "@/app/contexts/FormBuilderContext";
import TitleProps from "@/app/interfaces/form-component-interfaces/TitleProps";
import { CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import autosize from "autosize";
import React, { useContext, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

const Title = ({ props }: { props: TitleProps }) => {
	const { debounceRefs } = useContext(FormBuilderContext);

	const descriptionRef = useRef(null);
	const formTitleRef = useRef(null);

	const handleTitleChange = useDebouncedCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			props.title = e.target.value;
		},
		constants.debounceWait,
	);

	const handleDescriptionChange = useDebouncedCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			props.description = e.target.value;
		},
		constants.debounceWait,
	);

	useEffect(() => {
		if (descriptionRef.current == null) return;
		if (formTitleRef.current == null) return;
		autosize(descriptionRef.current);
		autosize(formTitleRef.current);

		debounceRefs
			.set(`0description`, handleDescriptionChange)
			.set(`0title`, handleTitleChange);
	}, []);

	return (
		<CardHeader className="mx-6 border-b px-0">
			<Textarea
				ref={formTitleRef}
				placeholder="Form Title"
				defaultValue={props.title}
				maxLength={250}
				className="borderless-input mb-3 h-[50px] resize-none text-2xl"
				onChange={handleTitleChange}
			/>
			<Textarea
				ref={descriptionRef}
				placeholder="Description"
				defaultValue={props.description}
				maxLength={750}
				className="h-[42px] resize-none text-base"
				onChange={handleDescriptionChange}
			/>
		</CardHeader>
	);
};

export default Title;
