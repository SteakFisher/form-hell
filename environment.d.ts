declare global {
	namespace NodeJS {
		interface ProcessEnv {
			API_KEY: string;
			AUTH_DOMAIN: string;
			PROJECT_ID: string;
			STORAGE_BUCKET: string;
			MESSAGING_SENDER_ID: string;
			APP_ID: string;

			TURSO_AUTH_TOKEN: string;
			TURSO_DB_URL: string;

			FIREBASE_SERVICE_ACCOUNT_KEY: string;

			AUTH_SECRET: string;

			AUTH_GOOGLE_ID: string;
			AUTH_GOOGLE_SECRET: string;
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
