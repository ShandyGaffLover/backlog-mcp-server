import { z } from "zod";
import { Backlog } from 'backlog-js';
import { buildToolSchema, ToolDefinition } from '../types/tool.js';
import { TranslationHelper } from "../createTranslationHelper.js";
import { WikiCountSchema } from "../types/zod/backlogOutputDefinition.js";

const getWikisCountSchema = buildToolSchema(t => ({
  projectIdOrKey: z.string().describe(t("TOOL_GET_WIKIS_COUNT_PROJECT_ID_OR_KEY", "Project ID or project key")),
}));

export const getWikisCountTool = (backlog: Backlog, { t }: TranslationHelper): ToolDefinition<ReturnType<typeof getWikisCountSchema>, typeof WikiCountSchema["shape"]> => {
  return {
    name: "get_wikis_count",
    description: t("TOOL_GET_WIKIS_COUNT_DESCRIPTION", "Returns count of wiki pages in a project"),
    schema: z.object(getWikisCountSchema(t)),
    outputSchema: WikiCountSchema,
    handler: async ({ projectIdOrKey }) => backlog.getWikisCount(projectIdOrKey),
  };
};
