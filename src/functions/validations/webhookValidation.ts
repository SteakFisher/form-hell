import { z } from "zod";
import { FormResponses } from "formhell-js";

type Errors = {
	[id: string]: string;
};

export async function webhookValidation(
	webhookURL: string,
	finalResponse: FormResponses,
) {
	let sendWebhookReq = () => {
		return new Promise<Errors | undefined>((resolve, reject) => {
			setTimeout(async () => {
				let webhookResponse = await fetch(webhookURL, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(finalResponse),
				});

				if (webhookResponse.status == 420) {
					let errorSchema = z.record(z.string(), z.string());
					let webhookError = await webhookResponse.json();

					try {
						let finalError: Errors = errorSchema.parse(webhookError);
						resolve(finalError);
					} catch (e) {
						resolve({});
					}
				} else resolve({});
			}, 2000);
			resolve({});
		});
	};

	return await sendWebhookReq();
}
