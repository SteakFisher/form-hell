import { sqliteTable, AnySQLiteColumn } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const Hi = sqliteTable("Hi", {
	Yes: text("Yes", { length: 10 }),
});