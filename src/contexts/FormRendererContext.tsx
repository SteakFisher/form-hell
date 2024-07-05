import { createContext } from "react";
import { FormResponses } from "formhell-js";

interface FormRendererContextInterface {
	formResponses: FormResponses;
}

export const FormRendererContext = createContext<FormRendererContextInterface>({
	formResponses: {},
});
