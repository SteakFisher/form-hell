import { createClient } from "@libsql/client";
import { AnyColumn, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

const turso = createClient({
	url: process.env.TURSO_DB_URL,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(turso);

export const increment = (column: AnyColumn, value = 1) => {
	return sql`${column} + ${value}`;
};
