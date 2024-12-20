"use client";

import { serverValidate } from "@/actions/validations";
import DateComponent from "@/components/form-display/DateComponent";
import DropdownComponent from "@/components/form-display/DropdownComponent";
import MediaComponent from "@/components/form-display/MediaComponent";
import MultipleChoiceComponent from "@/components/form-display/MultipleChoiceComponent";
import MultipleChoiceGridComponent from "@/components/form-display/MultipleChoiceGridComponent";
import RangeComponent from "@/components/form-display/RangeComponent";
import TextInputComponent from "@/components/form-display/TextInputComponent";
import TitleComponent from "@/components/form-display/TitleComponent";
import { Button } from "@/components/ui/button";
import { FormRendererContext } from "@/contexts/FormRendererContext";
import { FBFormObject } from "formhell-js";
import { FormResponses } from "formhell-js";
import { toast } from "sonner";
import { validateFormResponse } from "formhell-js";

export default function FormRenderer({
	formItemsObject,
	formResponses,
}: {
	formItemsObject: FBFormObject;
	formResponses: FormResponses;
}) {
	let formItems = formItemsObject.formItems;

	return (
		<form
			action={async () => {
				let { errors } = validateFormResponse(
					{
						formId: "placeholder",
						formItems,
						formTitleObj: {
							description: "placeholder",
							title: "placeholder",
						},
					},
					{ responseId: "dummyVal", formResponse: formResponses },
				);
				if (Object.keys(errors).length == 0) {
					errors = await serverValidate(
						formItemsObject.formId,
						formResponses,
					);
				}
				if (Object.keys(errors).length > 0) {
					Object.keys(errors).map((key) => {
						if (key === "error") {
							toast.error(errors[key]);
							return;
						}

						let name = formItems.filter((item) => item.id === key)[0]
							.props.title;
						toast.error(name, {
							description: errors[key],
						});
					});
				} else {
					toast.success("Form submitted successfully");
				}
			}}
			className={"flex flex-col justify-center "}
		>
			<FormRendererContext.Provider
				value={{
					formResponses: formResponses,
				}}
			>
				<TitleComponent props={formItemsObject.formTitleObj} />
				{formItems.map((item) => {
					switch (item.props.type) {
						case "text-input":
							return (
								<TextInputComponent
									key={item.id}
									id={item.id}
									item={item}
								/>
							);
						case "multiple-choice":
							return (
								<MultipleChoiceComponent
									key={item.id}
									id={item.id}
									item={item}
								/>
							);
						case "dropdown":
							return (
								<DropdownComponent
									key={item.id}
									id={item.id}
									item={item}
								/>
							);
						case "range":
							formResponses[item.id] = formResponses[item.id] ?? {
								range: item.props.min,
								type: "range",
							};
							return (
								<RangeComponent
									key={item.id}
									id={item.id}
									item={item}
								/>
							);
						case "multiple-choice-grid":
							return (
								<MultipleChoiceGridComponent
									key={item.id}
									id={item.id}
									item={item}
								/>
							);
						case "date":
							return (
								<DateComponent key={item.id} id={item.id} item={item} />
							);
						case "media":
							return (
								<MediaComponent
									key={item.id}
									id={item.id}
									item={item}
								/>
							);
						default:
							return null;
					}
				})}
			</FormRendererContext.Provider>
			<Button>
				<input className={"cursor-pointer"} type={"submit"} />
			</Button>
		</form>
	);
}
