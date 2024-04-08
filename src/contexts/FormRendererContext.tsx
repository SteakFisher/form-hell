import {createContext} from "react";
import FormItem from "@/interfaces/FormItem";
import FormResponse from "@/interfaces/FormResponse";

interface FormRendererContextInterface {
  formItems: FormItem[],
  formResponses: FormResponse
}

export const FormRendererContext = createContext<FormRendererContextInterface>({
  formItems: [],
  formResponses: {}
})