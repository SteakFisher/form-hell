import TextInputResponse from "@/interfaces/form-component-response-interfaces/TextInputResponse";
import DropdownResponse from "@/interfaces/form-component-response-interfaces/DropdownResponse";
import DateResponse from "@/interfaces/form-component-response-interfaces/DateResponse";
import MultipleChoiceResponse from "@/interfaces/form-component-response-interfaces/MultipleChoiceResponse";

export type Response =
TextInputResponse
| DropdownResponse
| DateResponse
| MultipleChoiceResponse;

export interface FormResponse <T extends Response> {
  [id: string] : T;
}