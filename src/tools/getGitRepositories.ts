import { z } from "zod";
import { Backlog } from 'backlog-js';
import { buildToolSchema, ToolDefinition } from '../types/tool.js';
import { TranslationHelper } from "../createTranslationHelper.js";
import { GitRepositorySchema } from "../types/zod/backlogOutputDefinition.js";

const getGitRepositoriesSchema = buildToolSchema(t => ({
  projectIdOrKey: z.string().describe(t("TOOL_GET_GIT_REPOSITORIES_PROJECT_ID_OR_KEY", "Project ID or project key")),
}));

export const getGitRepositoriesTool = (backlog: Backlog, { t }: TranslationHelper): ToolDefinition<ReturnType<typeof getGitRepositoriesSchema>, typeof GitRepositorySchema["shape"]> => {
  return {
    name: "get_git_repositories",
    description: t("TOOL_GET_GIT_REPOSITORIES_DESCRIPTION", "Returns list of Git repositories for a project"),
    schema: z.object(getGitRepositoriesSchema(t)),
    outputSchema: GitRepositorySchema,
    handler: async ({ projectIdOrKey }) => backlog.getGitRepositories(projectIdOrKey)
  };
};
