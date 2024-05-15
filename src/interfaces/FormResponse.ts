import TextInputResponse from "@/interfaces/form-component-response-interfaces/TextInputResponse";
import DropdownResponse from "@/interfaces/form-component-response-interfaces/DropdownResponse";
import DateResponse from "@/interfaces/form-component-response-interfaces/DateResponse";
import MultipleChoiceResponse from "@/interfaces/form-component-response-interfaces/MultipleChoiceResponse";
import MultipleChoiceGridResponse from "@/interfaces/form-component-response-interfaces/MultipleChoiceGridResponse";

export type Response =
TextInputResponse
| DropdownResponse
| DateResponse
| MultipleChoiceResponse
| MultipleChoiceGridResponse;

export interface FormResponse <T extends Response> {
  [id: string] : T;
}