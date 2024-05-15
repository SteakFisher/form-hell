import TextInputResponse from "@/interfaces/form-component-response-interfaces/TextInputResponse";
import DropdownResponse from "@/interfaces/form-component-response-interfaces/DropdownResponse";
import DateResponse from "@/interfaces/form-component-response-interfaces/DateResponse";
import MultipleChoiceResponse from "@/interfaces/form-component-response-interfaces/MultipleChoiceResponse";
import MultipleChoiceGridResponse from "@/interfaces/form-component-response-interfaces/MultipleChoiceGridResponse";
import RangeResponse from "@/interfaces/form-component-response-interfaces/RangeResponse";

export type Response =
TextInputResponse
| DropdownResponse
| DateResponse
| MultipleChoiceResponse
| MultipleChoiceGridResponse
| RangeResponse;

export interface FormResponse <T extends Response> {
  [id: string] : T;
}