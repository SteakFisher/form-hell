import { CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { constants, titleConstants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import TitleProps from "@/interfaces/form-component-interfaces/TitleProps";
import autosize from "autosize";
import React, { useContext, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

const Title = ({ props }: { props: TitleProps }) => {
	const { debounceRefs, focusedItemRef } = useContext(FormBuilderContext);

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

		debounceRefs.set(
			"0",
			new Map([
				["description", handleDescriptionChange],
				["title", handleTitleChange],
			]),
		);
	}, []);

	return (
		<CardHeader
			className="mx-6 mb-6 border-b px-0"
			tabIndex={-1}
			onFocus={() =>
				(focusedItemRef.current = { id: "0", blurItem: () => {} })
			}
		>
			<Textarea
				ref={formTitleRef}
				placeholder="Form Title"
				defaultValue={props.title}
				maxLength={titleConstants.formTitleMaxLength}
				className="borderless-input mb-3 h-[50px] resize-none text-2xl"
				onChange={handleTitleChange}
			/>
			<Textarea
				ref={descriptionRef}
				placeholder="Description"
				defaultValue={props.description}
				maxLength={titleConstants.formDescMaxLength}
				className="h-[42px] resize-none text-base"
				onChange={handleDescriptionChange}
			/>
		</CardHeader>
	);
};

export default Title;
