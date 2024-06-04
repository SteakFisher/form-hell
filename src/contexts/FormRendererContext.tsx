import {createContext} from "react";
import {FormResponse} from "@/interfaces/FormResponse";
import {Response} from "@/interfaces/FormResponse";

interface FormRendererContextInterface {
  formResponses: FormResponse<Response>
}

export const FormRendererContext = createContext<FormRendererContextInterface>({
  formResponses: {}
})