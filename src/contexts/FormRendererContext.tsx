import {createContext} from "react";
import FormResponse from "@/interfaces/FormResponse";

interface FormRendererContextInterface {
  formResponses: FormResponse
}

export const FormRendererContext = createContext<FormRendererContextInterface>({
  formResponses: {}
})