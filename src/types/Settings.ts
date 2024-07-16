export type SettingsObject = {
	formAccess: formAccessProps;
};

export type formAccessProps = Map<string, "read" | "write" | "owner">;
