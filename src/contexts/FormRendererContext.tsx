import {createContext} from "react";
import FormItem from "@/interfaces/FormItem";

interface FormRendererContextInterface {
  formItems: FormItem[]
}

export const FormRendererContext = createContext<FormRendererContextInterface>({
  formItems: []
})