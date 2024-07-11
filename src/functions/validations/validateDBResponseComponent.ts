import {
	DateResponse,
	DropdownResponse,
	getDateValidateObject,
	getDropdownValidateObject,
	getInputValidateObject,
	getMultipleChoiceGridValidateObject,
	getMultipleChoiceValidateObject,
	getRangeValidateObject,
	MultipleChoiceGridResponse,
	MultipleChoiceResponse,
	RangeResponse,
	Response,
	TextInputResponse,
} from "formhell-js";

export default function validateDBResponseComponent(
	dataProps: Response,
): Response {
	switch (dataProps.type) {
		case "text-input":
			const zodInputObj = getInputValidateObject();
			let { data: inputFinalData, success: inputSuccess } =
				zodInputObj.safeParse(dataProps);
			if (!inputSuccess) throw new Error("Text input structure invalid");
			return inputFinalData as TextInputResponse;

		case "date":
			const zodDateObj = getDateValidateObject();
			let dateData = {
				type: "date",
				// @ts-ignore
				date: new Date(dataProps.date.seconds * 1000),
			} as DateResponse;
			let { data: dateFinalData, success: dateSuccess } =
				zodDateObj.safeParse(dateData);
			if (!dateSuccess) throw new Error("Date structure invalid");
			return dateFinalData as DateResponse;

		case "range":
			const zodRangeObj = getRangeValidateObject();
			let { data: rangeFinalData, success: rangeSuccess } =
				zodRangeObj.safeParse(dataProps);
			if (!rangeSuccess) throw new Error("Range structure invalid");
			return rangeFinalData as RangeResponse;

		case "dropdown":
			const zodDropdownObj = getDropdownValidateObject();
			let { data: dropdownFinalData, success: dropdownSuccess } =
				zodDropdownObj.safeParse(dataProps);
			if (!dropdownSuccess) throw new Error("Dropdown structure invalid");
			return dropdownFinalData as DropdownResponse;

		case "multiple-choice":
			const zodMultipleChoiceObj = getMultipleChoiceValidateObject();
			let { data: multipleChoiceFinalData, success: multipleChoiceSuccess } =
				zodMultipleChoiceObj.safeParse(dataProps);
			if (!multipleChoiceSuccess)
				throw new Error("Multiple Choice structure invalid");
			return multipleChoiceFinalData as MultipleChoiceResponse;

		case "multiple-choice-grid":
			const zodMultipleChoiceGridObj = getMultipleChoiceGridValidateObject();

			let newDataProps = {
				type: "multiple-choice-grid",
				selected: {},
			} as MultipleChoiceGridResponse;

			let multipleChoiceGridDataProps = dataProps.selected;

			Object.keys(multipleChoiceGridDataProps).map((row) => {
				newDataProps.selected[row] = new Set(
					multipleChoiceGridDataProps[row],
				);
			});

			let {
				data: multipleChoiceGridFinalData,
				success: multipleChoiceGridSuccess,
			} = zodMultipleChoiceGridObj.safeParse(newDataProps);
			if (!multipleChoiceGridSuccess)
				throw new Error("Multiple Choice Grid structure invalid");
			return multipleChoiceGridFinalData as MultipleChoiceGridResponse;

		default:
			throw new Error("Invalid structure");
	}
}
