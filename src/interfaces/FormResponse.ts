import TextInputResponse from "@/interfaces/form-component-response-interace/TextInputResponse";
import DropdownResponse from "@/interfaces/form-component-response-interace/DropdownResponse";
import DateResponse from "@/interfaces/form-component-response-interace/DateResponse";
import MultipleChoiceResponse from "@/interfaces/form-component-response-interace/MultipleChoiceResponse";

export default interface FormResponse {
  id: string;
  response:
    TextInputResponse
  | DropdownResponse
  | DateResponse
  | MultipleChoiceResponse;
}