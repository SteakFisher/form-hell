import {
	constants,
	dropdownConstants,
	mediaConstants,
	multipleChoiceConstants,
	rangeConstants,
	textInputConstants,
	titleConstants,
} from "@/constants";
import { validateImageUrl, validateVideoUrl } from "@/functions/mediaHelpers";
import { validateRegex } from "@/functions/validations/validateRegex";
import {
	DateProps,
	DropdownProps,
	FBFormObject,
	FormItem,
	MediaProps,
	MultipleChoiceGridProps,
	MultipleChoiceProps,
	RangeProps,
	TextInputProps,
} from "formhell-js";
import { z } from "zod";

export type FBValidateError = { id: string; message: string };

export async function FBValidate(
	formObject: FBFormObject,
): Promise<FBValidateError> {
	const formObjectError = z
		.object(
			{
				formId: z
					.string({
						invalid_type_error:
							"The 'formId' prop must be of type 'string'",
						required_error: "The 'formId' prop is required",
					})
					.uuid({
						message: "formId is not a valid uuid",
					}),
				formItems: z
					.any({
						invalid_type_error: "The 'formItems' prop must be an array",
						required_error: "The 'formItems' prop is required",
					})
					.array(),
				formTitleObj: z
					.object(
						{
							description: z
								.string({
									invalid_type_error:
										"The 'description' prop must be of type 'string'",
									required_error: "The 'description' prop is required",
								})
								.max(
									titleConstants.formDescMaxLength,
									`Form description must not exceed ${titleConstants.formDescMaxLength} characters`,
								),
							title: z
								.string({
									invalid_type_error:
										"The 'title' prop must be of type 'string'",
									required_error: "The 'title' prop is required",
								})
								.max(
									titleConstants.formTitleMaxLength,
									`Form title must not exceed ${titleConstants.formTitleMaxLength} characters`,
								)
								.trim()
								.min(1, "Form title is required"),
						},
						{
							invalid_type_error: "Invalid form title object",
							required_error: "Form title object is required",
						},
					)
					.strict(),
			},
			{
				invalid_type_error: "Invalid form object",
				required_error: "Form object is required",
			},
		)
		.strict()
		.safeParse(formObject);

	if (!formObjectError.success) {
		return {
			id: "0",
			message: formObjectError.error.errors[0].message,
		};
	}

	const formItems = formObject.formItems;
	return ValidateFormItems(formItems);
}

export async function ValidateFormItems(
	formItems: FormItem[],
): Promise<FBValidateError> {
	if (formItems.length === 0) {
		return { id: "0", message: "Form must have atleast one element" };
	}
	for (const formItem of formItems) {
		const formItemError = await z
			.object({
				id: z
					.string({
						invalid_type_error: `The 'id' prop must be of type 'string'`,
						required_error: "The 'id' prop is required",
					})
					.uuid({
						message: "id is not a valid uuid",
					}),
				props: z.any({
					required_error: "The 'props' prop is required",
				}),
				mediaProps: z
					.object({
						mediaAltText: z
							.string({
								invalid_type_error: `The 'mediaAltText' prop must be of type 'string'`,
								required_error: "The 'mediaAltText' prop is required",
							})
							.max(mediaConstants.altTextMaxLength, {
								message: `Alt text must not exceed ${mediaConstants.altTextMaxLength} characters`,
							}),
						mediaType: z.union([z.literal("image"), z.literal("video")], {
							invalid_type_error: `The 'mediaType' prop must be of type 'image' | 'video'`,
							required_error: "The 'mediaType' prop is required",
						}),
						mediaUrl: z
							.string({
								invalid_type_error: `The 'mediaUrl' prop must be of type 'string'`,
								required_error: "The 'mediaUrl' prop is required",
							})
							.refine(
								async (url) => {
									if (url === "") return true;
									await validateUrl(
										url,
										formItem.mediaProps.mediaType,
									);
								},
								{
									message: "Invalid url",
								},
							),
					})
					.strict(),
			})
			.strict()
			.safeParseAsync(formItem);

		if (!formItemError.success) {
			return {
				id: formItem.id,
				message: formItemError.error.errors[0].message,
			};
		}

		let propsError = "";
		switch (formItem.props.type) {
			case "date": {
				propsError = validateDate(formItem.props).error;
				break;
			}
			case "dropdown": {
				propsError = validateDropdown(formItem.props).error;
				break;
			}
			case "media": {
				const _propsError = await validateMedia(formItem.props);
				propsError = _propsError.error;
				break;
			}
			case "multiple-choice": {
				propsError = validateMultipleChoice(formItem.props).error;
				break;
			}
			case "multiple-choice-grid": {
				propsError = validateMultipleChoiceGrid(formItem.props).error;
				break;
			}
			case "range": {
				propsError = validateRange(formItem.props).error;
				break;
			}
			case "text-input": {
				propsError = validateTextInput(formItem.props).error;
				break;
			}

			default: {
				return { id: formItem.id, message: "Invalid item type" };
			}
		}
		if (propsError) {
			return { id: formItem.id, message: propsError };
		}
	}

	return { id: "", message: "" };
}

type validateResult = { error: string };

function validateDate(props: DateProps): validateResult {
	const parseResult = z
		.object({
			required: z.boolean({
				invalid_type_error: `The 'required' prop must be of type 'boolean'`,
				required_error: "The 'required' prop is required",
			}),
			title: z
				.string({
					invalid_type_error: `The 'title' prop must be of type 'string'`,
					required_error: "The 'title' prop is required",
				})
				.max(constants.formItemTitleMaxLength, {
					message: `Date title must not exceed ${constants.formItemTitleMaxLength}`,
				}),
			type: z.literal("date", {
				invalid_type_error: "Invalid date object",
				required_error: "Invalid date object",
			}),
		})
		.strict({ message: "Invalid date object" })
		.safeParse(props);

	if (!parseResult.success) {
		return { error: parseResult.error.errors[0].message };
	}
	return { error: "" };
}

function validateDropdown(props: DropdownProps): validateResult {
	const parseResult = z
		.object({
			items: z
				.object(
					{
						id: z
							.string({
								invalid_type_error: "Invalid dropdown item ID",
								required_error: "Invalid dropdown item ID",
							})
							.uuid({ message: "Invalid dropdown item ID" }),
						value: z
							.string({
								invalid_type_error:
									"Dropdown item value must be of type 'string'",
								required_error: "Dropdown item value is required",
							})
							.max(dropdownConstants.itemMaxLength, {
								message: `Dropdown item value must not exceed ${dropdownConstants.itemMaxLength} characters`,
							})
							.trim()
							.min(1, {
								message: "Dropdown item value must not be empty",
							}),
					},
					{
						invalid_type_error: "Invalid 'items' prop",
						required_error: "The 'items' prop is required",
					},
				)
				.strict({ message: "Invalid 'items' prop" })
				.array()
				.min(1, { message: "Dropdown must have atleast one item" })
				.max(10, { message: "Dropdown can only have upto 10 items" }),
			required: z.boolean({
				invalid_type_error: `The 'required' prop must be of type 'boolean'`,
				required_error: "The 'required' prop is required",
			}),
			title: z
				.string({
					invalid_type_error: `The 'title' prop must be of type 'string'`,
					required_error: "The 'title' prop is required",
				})
				.max(constants.formItemTitleMaxLength, {
					message: `Dropdown title must not exceed ${constants.formItemTitleMaxLength}`,
				}),
			type: z.literal("dropdown", {
				invalid_type_error: "Invalid dropdown object",
				required_error: "Invalid dropdown object",
			}),
		})
		.strict()
		.safeParse(props);

	if (!parseResult.success) {
		return { error: parseResult.error.errors[0].message };
	}
	return { error: "" };
}

async function validateMedia(props: MediaProps): Promise<validateResult> {
	const parseResult = await z
		.object({
			altText: z
				.string({
					invalid_type_error: `The 'altText' prop must be of type 'string'`,
					required_error: "The 'altText' prop is required",
				})
				.max(mediaConstants.altTextMaxLength, {
					message: `alt text must not exceed ${mediaConstants.altTextMaxLength} characters`,
				}),
			mediaType: z.union([z.literal("image"), z.literal("video")], {
				invalid_type_error: `The 'mediaType' prop must be of type 'image' | 'video'`,
				required_error: "The 'mediaType' prop is required",
			}),
			required: z.boolean({
				invalid_type_error: `The 'required' prop must be of type 'boolean'`,
				required_error: "The 'required' prop is required",
			}),
			title: z
				.string({
					invalid_type_error: `The 'title' prop must be of type 'string'`,
					required_error: "The 'title' prop is required",
				})
				.max(constants.formItemTitleMaxLength, {
					message: `Media title must not exceed ${constants.formItemTitleMaxLength}`,
				}),
			type: z.literal("media", {
				invalid_type_error: "Invalid media object",
				required_error: "Invalid media object",
			}),
			url: z
				.string({
					invalid_type_error: `The 'url' prop must be of type 'string'`,
					required_error: "The 'url' prop is required",
				})
				.min(1, { message: "Url must not be empty" })
				.refine(async (url) => await validateUrl(url, props.mediaType), {
					message: "Invalid url",
				}),
		})
		.strict()
		.safeParseAsync(props);

	if (!parseResult.success) {
		return { error: parseResult.error.errors[0].message };
	}
	return { error: "" };
}

function validateMultipleChoice(props: MultipleChoiceProps): validateResult {
	const parseResult = z
		.object({
			allowMultiple: z.boolean({
				invalid_type_error: `The 'allowMultiple' prop must be of type 'boolean'`,
				required_error: "The 'allowMultiple' prop is required",
			}),
			hasOther: z.boolean({
				invalid_type_error: `The 'hasOther' prop must be of type 'boolean'`,
				required_error: "The 'hasOther' prop is required",
			}),
			items: z
				.object(
					{
						id: z
							.string({
								invalid_type_error: "Invalid multiple choice item ID",
								required_error: "Invalid multiple choice item ID",
							})
							.uuid({ message: "Invalid multiple choice item ID" }),
						value: z
							.string({
								invalid_type_error:
									"Multiple choice item value must be of type 'string'",
								required_error:
									"Multiple choice item value is required",
							})
							.max(multipleChoiceConstants.itemMaxLength, {
								message: `Multiple choice item value must not exceed ${multipleChoiceConstants.itemMaxLength} characters`,
							})
							.trim()
							.min(1, {
								message: "Multiple choice item value must not be empty",
							}),
					},
					{
						invalid_type_error: "Invalid 'items' prop",
						required_error: "The 'items' prop is required",
					},
				)
				.strict({ message: "Invalid 'items' prop" })
				.array()
				.min(1, { message: "Multiple choice must have atleast one item" })
				.max(10, {
					message: "Multiple choice can only have upto 10 items",
				}),
			required: z.boolean({
				invalid_type_error: `The 'required' prop must be of type 'boolean'`,
				required_error: "The 'required' prop is required",
			}),
			title: z
				.string({
					invalid_type_error: `The 'title' prop must be of type 'string'`,
					required_error: "The 'title' prop is required",
				})
				.max(constants.formItemTitleMaxLength, {
					message: `Multiple choice title must not exceed ${constants.formItemTitleMaxLength}`,
				}),
			type: z.literal("multiple-choice", {
				invalid_type_error: "Invalid multiple choice object",
				required_error: "Invalid multiple choice object",
			}),
		})
		.strict()
		.safeParse(props);

	if (!parseResult.success) {
		return { error: parseResult.error.errors[0].message };
	}
	return { error: "" };
}

function validateMultipleChoiceGrid(
	props: MultipleChoiceGridProps,
): validateResult {
	const parseResult = z
		.object({
			allowMultiple: z.boolean({
				invalid_type_error: `The 'allowMultiple' prop must be of type 'boolean'`,
				required_error: "The 'allowMultiple' prop is required",
			}),
			columns: z
				.object(
					{
						id: z
							.string({
								invalid_type_error:
									"Invalid multiple choice grid column ID",
								required_error:
									"Invalid multiple choice grid column ID",
							})
							.uuid({
								message: "Invalid multiple choice grid column ID",
							}),
						value: z
							.string({
								invalid_type_error:
									"Multiple choice grid column value must be of type 'string'",
								required_error:
									"Multiple choice grid column value is required",
							})
							.max(multipleChoiceConstants.itemMaxLength, {
								message: `Multiple choice grid column value must not exceed ${multipleChoiceConstants.itemMaxLength} characters`,
							})
							.trim()
							.min(1, {
								message:
									"Multiple choice grid column value must not be empty",
							}),
					},
					{
						invalid_type_error: "Invalid 'columns' prop",
						required_error: "The 'columns' prop is required",
					},
				)
				.strict({ message: "Invalid 'columns' prop" })
				.array()
				.min(1, {
					message: "Multiple choice grid must have atleast one column",
				})
				.max(10, {
					message: "Multiple choice grid can only have upto 10 columns",
				}),
			required: z.boolean({
				invalid_type_error: `The 'required' prop must be of type 'boolean'`,
				required_error: "The 'required' prop is required",
			}),
			rows: z
				.object(
					{
						id: z
							.string({
								invalid_type_error:
									"Invalid multiple choice grid row ID",
								required_error: "Invalid multiple choice grid row ID",
							})
							.uuid({ message: "Invalid multiple choice grid row ID" }),
						value: z
							.string({
								invalid_type_error:
									"Multiple choice grid row value must be of type 'string'",
								required_error:
									"Multiple choice grid row value is required",
							})
							.max(multipleChoiceConstants.itemMaxLength, {
								message: `Multiple choice grid row value must not exceed ${multipleChoiceConstants.itemMaxLength} characters`,
							})
							.trim()
							.min(1, {
								message:
									"Multiple choice grid row value must not be empty",
							}),
					},
					{
						invalid_type_error: "Invalid 'rows' prop",
						required_error: "The 'rows' prop is required",
					},
				)
				.strict({ message: "Invalid 'rows' prop" })
				.array()
				.min(1, {
					message: "Multiple choice grid must have atleast one row",
				})
				.max(10, {
					message: "Multiple choice grid can only have upto 10 rows",
				}),
			title: z
				.string({
					invalid_type_error: `The 'title' prop must be of type 'string'`,
					required_error: "The 'title' prop is required",
				})
				.max(constants.formItemTitleMaxLength, {
					message: `Multiple choice grid title must not exceed ${constants.formItemTitleMaxLength}`,
				}),
			type: z.literal("multiple-choice-grid", {
				invalid_type_error: "Invalid multiple choice grid object",
				required_error: "Invalid multiple choice grid object",
			}),
		})
		.strict()
		.safeParse(props);

	if (!parseResult.success) {
		return { error: parseResult.error.errors[0].message };
	}
	return { error: "" };
}

function validateRange(props: RangeProps): validateResult {
	const parseResult = z
		.object({
			min: z
				.number({
					invalid_type_error: `Min. must be of type 'number'`,
					required_error: "Min. is required",
				})
				.int({ message: "Min. must be an integer" }),
			max: z
				.number({
					invalid_type_error: "Max. must be of type 'number'",
					required_error: "Max. is required",
				})
				.int({ message: "Max. must be an integer" })
				.gt(props.min, { message: "Max. must be greater than min." }),
			required: z.boolean({
				invalid_type_error: "The 'required' prop must be of type 'boolean'",
				required_error: "The 'required' prop is required",
			}),
			step: z
				.number({
					invalid_type_error: "Step must be of type 'number'",
					required_error: "Step is required",
				})
				.int({ message: "Step must be an integer" })
				.refine((step) => {
					const stepCount = (props.max - props.min) / step;
					return (
						stepCount >= 1 && stepCount <= rangeConstants.maxStepCount
					);
				}),
			title: z
				.string({
					invalid_type_error: `The 'title' prop must be of type 'string'`,
					required_error: "The 'title' prop is required",
				})
				.max(constants.formItemTitleMaxLength, {
					message: `Range title must not exceed ${constants.formItemTitleMaxLength}`,
				}),
			type: z.literal("range", {
				invalid_type_error: "Invalid range object",
				required_error: "Invalid range object",
			}),
		})
		.strict()
		.safeParse(props);

	if (!parseResult.success) {
		return { error: parseResult.error.errors[0].message };
	}
	return { error: "" };
}

function validateTextInput(props: TextInputProps): validateResult {
	const parseResult = z
		.object({
			lengthType: z.union([z.literal("words"), z.literal("characters")], {
				invalid_type_error:
					"The prop 'lengthType' must be of type 'words' | 'characters'",
				required_error: "The prop 'lengthType' is required",
			}),
			minLength: z
				.number({
					invalid_type_error: `Min. length must be of type 'number'`,
					required_error: "Min. length is required",
				})
				.int({
					message: "Min. length must be an integer",
				})
				.nonnegative({ message: "Min. length must be non-negative" })
				.lt(textInputConstants.lengthsMax, {
					message: `Min. length must be less than ${textInputConstants.lengthsMax}`,
				}),
			maxLength: z
				.number({
					invalid_type_error: "Max. length must be of type 'number'",
					required_error: "Max. length is required",
				})
				.int({
					message: "Max. length must be an integer",
				})
				.gte(props.minLength, {
					message:
						"Max. length must be greater than or equal to min. length",
				})
				.lt(textInputConstants.lengthsMax, {
					message: `Max. length must be less than ${textInputConstants.lengthsMax}`,
				}),
			multiline: z.boolean({
				invalid_type_error:
					"The prop 'multiline' must be of type 'boolean'",
				required_error: "The prop 'multiline' is required",
			}),
			regexPattern: z
				.string({
					invalid_type_error:
						"The prop 'regexPattern' must be of type 'string'",
					required_error: "The prop 'regexPattern' is required",
				})
				.max(textInputConstants.regexPatternMaxLength, {
					message: `The prop 'regexPattern' must not exceed ${textInputConstants.regexPatternMaxLength} characters`,
				})
				.refine(
					(pattern) => {
						const error = validateRegex(pattern, "");
						return !error;
					},
					{ message: "Invalid regex pattern" },
				),
			regexFlags: z
				.string({
					invalid_type_error:
						"The prop 'regexFlags' must be of type 'string'",
					required_error: "The prop 'regexFlags' is required",
				})
				.max(textInputConstants.regexPatternMaxLength, {
					message: `The prop 'regexFlags' must not exceed ${textInputConstants.regexPatternMaxLength} characters`,
				})
				.refine(
					(flags) => {
						const error = validateRegex(props.regexPattern, flags);
						return !error;
					},
					{ message: "Invalid regex flags" },
				),
			required: z.boolean({
				invalid_type_error: `The 'required' prop must be of type 'boolean'`,
				required_error: "The 'required' prop is required",
			}),
			title: z
				.string({
					invalid_type_error: `The 'title' prop must be of type 'string'`,
					required_error: "The 'title' prop is required",
				})
				.max(constants.formItemTitleMaxLength, {
					message: `Text input title must not exceed ${constants.formItemTitleMaxLength}`,
				}),
			type: z.literal("text-input", {
				invalid_type_error: "Invalid text input object",
				required_error: "Invalid text input object",
			}),
		})
		.strict()
		.safeParse(props);

	if (!parseResult.success) {
		return { error: parseResult.error.errors[0].message };
	}
	return { error: "" };
}

async function validateUrl(url: string, mediaType: "image" | "video") {
	if (url === "") return true;
	if (mediaType === "image") {
		const error = await validateImageUrl(url);
		if (error) return false;
		return true;
	} else if (mediaType === "video") {
		const error = validateVideoUrl(url, { current: "" });
		if (error) return false;
		return true;
	}

	return false;
}
