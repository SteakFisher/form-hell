export default interface FormItem {
	id: number;
	type: string;
	props: { [key: string]: string | number };
}
