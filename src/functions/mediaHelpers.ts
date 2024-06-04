import getVideoId from "get-video-id";
import { MutableRefObject } from "react";

export async function validateImageUrl(url: string): Promise<string> {
	try {
		new URL(url);
	} catch (e) {
		return "Invalid URL";
	}

	try {
		const response = await fetch(url, { method: "HEAD" });

		if (!response.ok) {
			return `HTTP error! Status: ${response.status}`;
		}

		const contentType = response.headers.get("Content-Type");
		if (!contentType || !contentType.startsWith("image/")) {
			return "URL does not point to a valid image";
		}
	} catch (error) {
		return "Failed to fetch the URL";
	}
	return "";
}

export function validateVideoUrl(
	url: string,
	videoIdRef: MutableRefObject<string>,
): string {
	try {
		new URL(url);
	} catch (e) {
		return "Invalid URL";
	}
	const { id, service } = getVideoId(url);
	if (service !== "youtube") return "Invalid URL";
	if (!id) return "Invalid URL";

	videoIdRef.current = id;
	return "";
}
