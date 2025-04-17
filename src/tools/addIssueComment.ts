import { z } from "zod";
import { Backlog } from 'backlog-js';
import { buildToolSchema, Output, ToolDefinition } from "../toolDefinition.js";
import { TranslationHelper } from "../createTranslationHelper.js";

const addIssueCommentSchema = buildToolSchema(t => ({
  issueIdOrKey: z.union([z.string(), z.number()]).describe(t("TOOL_ADD_ISSUE_COMMENT_ISSUE_ID_OR_KEY", "Issue ID or issue key")),
  content: z.string().describe(t("TOOL_ADD_ISSUE_COMMENT_CONTENT", "Comment content")),
  notifiedUserId: z.array(z.number()).optional().describe(t("TOOL_ADD_ISSUE_COMMENT_NOTIFIED_USER_ID", "User IDs to notify")),
  attachmentId: z.array(z.number()).optional().describe(t("TOOL_ADD_ISSUE_COMMENT_ATTACHMENT_ID", "Attachment IDs")),
}));

export const addIssueCommentTool = (backlog: Backlog, { t }: TranslationHelper): ToolDefinition<ReturnType<typeof addIssueCommentSchema>, Output> => {
  return {
    name: "add_issue_comment",
    description: t("TOOL_ADD_ISSUE_COMMENT_DESCRIPTION", "Adds a comment to an issue"),
    schema: z.object(addIssueCommentSchema(t)),
    handler: async ({ issueIdOrKey, content, notifiedUserId, attachmentId }) => {
      const comment = await backlog.postIssueComments(issueIdOrKey, {
        content,
        notifiedUserId,
        attachmentId
      });
      
      return {
        content: [{ type: "text", text: JSON.stringify(comment, null, 2) }]
      };
    }
  };
};
