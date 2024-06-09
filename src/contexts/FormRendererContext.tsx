import {createContext} from "react";
import {FormResponses} from "@/interfaces/FormResponses";
import {Response} from "@/interfaces/FormResponses";

interface FormRendererContextInterface {
  formResponses: FormResponses<Response>
}

export const FormRendererContext = createContext<FormRendererContextInterface>({
  formResponses: {}
})