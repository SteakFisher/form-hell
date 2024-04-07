import TextInputResponse from "@/interfaces/form-component-response-interfaces/TextInputResponse";
import DropdownResponse from "@/interfaces/form-component-response-interfaces/DropdownResponse";
import DateResponse from "@/interfaces/form-component-response-interfaces/DateResponse";
import MultipleChoiceResponse from "@/interfaces/form-component-response-interfaces/MultipleChoiceResponse";

export default interface FormResponse {
  id: string;
  response:
    TextInputResponse
  | DropdownResponse
  | DateResponse
  | MultipleChoiceResponse;
}