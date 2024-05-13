import {createContext} from "react";
import FormItem from "@/interfaces/FormItem";
import {FormResponse} from "@/interfaces/FormResponse";

interface FormRendererContextInterface {
  formResponses: FormResponse<any>
}

export const FormRendererContext = createContext<FormRendererContextInterface>({
  formResponses: {}
})