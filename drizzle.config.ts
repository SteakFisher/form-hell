import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
	path: ".env.local",
});

export default {
	schema: "./drizzle/schema.ts",
	out: "./drizzle/migrations",
	dialect: "sqlite",
	driver: "turso",
	dbCredentials: {
		url: process.env.TURSO_DB_URL,
		authToken: process.env.TURSO_AUTH_TOKEN,
	},
} satisfies Config;
