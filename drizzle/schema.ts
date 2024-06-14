import FormItem from "@/interfaces/FormItem";
import {
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const formsTable = sqliteTable(
	"forms",
	{
		formId: text("formId").primaryKey(),
		userId: text("userId").notNull(),
		formJson: text("formJson", { mode: "json" }).notNull().$type<FormItem[]>(),
		version: integer("version", { mode: "number" }).notNull(),
	},
	(table) => {
		return {
			formIdInd: uniqueIndex("formId_ind").on(table.formId),
			userIdInd: index("userId_ind").on(table.userId),
		};
	},
);
