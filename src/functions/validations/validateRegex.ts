export function validateRegex(pattern: string, flags: string): string {
	try {
		new RegExp(pattern);
	} catch {
		return "Enter a valid regex pattern";
	}

	try {
		new RegExp(pattern, flags);
	} catch {
		return "Invalid flags";
	}
	return "";
}
