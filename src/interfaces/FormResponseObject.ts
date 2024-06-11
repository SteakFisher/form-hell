import { FormResponses, Response } from "@/interfaces/FormResponses";

export default interface FormResponseObject{
	responseId: string;
	formResponse: FormResponses<Response>;
}