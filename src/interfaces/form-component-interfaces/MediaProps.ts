export default interface MediaProps {
	altText: string;
	mediaType: "image" | "video";
	required: false;
	title: string;
	type: "media";
	url: string;
}
