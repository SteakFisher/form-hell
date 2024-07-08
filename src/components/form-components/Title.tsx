import { CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { titleConstants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import autosize from "autosize";
import { useContext, useEffect, useRef } from "react";

const Title = () => {
	const { focusedItemRef, formDesc, formTitle, setFormDesc, setFormTitle } =
		useContext(FormBuilderContext);

	const descriptionRef = useRef(null);
	const formTitleRef = useRef(null);

	useEffect(() => {
		if (descriptionRef.current == null) return;
		if (formTitleRef.current == null) return;
		autosize(descriptionRef.current);
		autosize(formTitleRef.current);
	}, []);

	return (
		<CardHeader
			className="mx-6 mb-6 border-b px-0"
			id="0"
			tabIndex={-1}
			onFocus={() =>
				(focusedItemRef.current = { id: "0", blurItem: () => {} })
			}
		>
			<Textarea
				ref={formTitleRef}
				placeholder="Form Title"
				value={formTitle}
				maxLength={titleConstants.formTitleMaxLength}
				className="borderless-input mb-3 h-[50px] resize-none text-2xl"
				onChange={(e) => setFormTitle(e.target.value)}
			/>
			<Textarea
				ref={descriptionRef}
				placeholder="Description"
				value={formDesc}
				maxLength={titleConstants.formDescMaxLength}
				className="h-[42px] resize-none text-base"
				onChange={(e) => setFormDesc(e.target.value)}
			/>
		</CardHeader>
	);
};

export default Title;
