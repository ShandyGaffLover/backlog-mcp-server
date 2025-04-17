import { z } from "zod";
import { Backlog } from 'backlog-js';
import { buildToolSchema, Output, ToolDefinition } from "../toolDefinition.js";
import { TranslationHelper } from "../createTranslationHelper.js";

const updateIssueSchema = buildToolSchema(t => ({
  issueIdOrKey: z.union([z.string(), z.number()]).describe(t("TOOL_UPDATE_ISSUE_ISSUE_ID_OR_KEY", "Issue ID or issue key")),
  summary: z.string().optional().describe(t("TOOL_UPDATE_ISSUE_SUMMARY", "Summary of the issue")),
  issueTypeId: z.number().optional().describe(t("TOOL_UPDATE_ISSUE_ISSUE_TYPE_ID", "Issue type ID")),
  priorityId: z.number().optional().describe(t("TOOL_UPDATE_ISSUE_PRIORITY_ID", "Priority ID")),
  description: z.string().optional().describe(t("TOOL_UPDATE_ISSUE_DESCRIPTION", "Detailed description of the issue")),
  startDate: z.string().optional().describe(t("TOOL_UPDATE_ISSUE_START_DATE", "Scheduled start date (yyyy-MM-dd)")),
  dueDate: z.string().optional().describe(t("TOOL_UPDATE_ISSUE_DUE_DATE", "Scheduled due date (yyyy-MM-dd)")),
  estimatedHours: z.number().optional().describe(t("TOOL_UPDATE_ISSUE_ESTIMATED_HOURS", "Estimated work hours")),
  actualHours: z.number().optional().describe(t("TOOL_UPDATE_ISSUE_ACTUAL_HOURS", "Actual work hours")),
  categoryId: z.array(z.number()).optional().describe(t("TOOL_UPDATE_ISSUE_CATEGORY_ID", "Category IDs")),
  versionId: z.array(z.number()).optional().describe(t("TOOL_UPDATE_ISSUE_VERSION_ID", "Version IDs")),
  milestoneId: z.array(z.number()).optional().describe(t("TOOL_UPDATE_ISSUE_MILESTONE_ID", "Milestone IDs")),
  statusId: z.number().optional().describe(t("TOOL_UPDATE_ISSUE_STATUS_ID", "Status ID")),
  resolutionId: z.number().optional().describe(t("TOOL_UPDATE_ISSUE_RESOLUTION_ID", "Resolution ID")),
  assigneeId: z.number().optional().describe(t("TOOL_UPDATE_ISSUE_ASSIGNEE_ID", "User ID of the assignee")),
  notifiedUserId: z.array(z.number()).optional().describe(t("TOOL_UPDATE_ISSUE_NOTIFIED_USER_ID", "User IDs to notify")),
  attachmentId: z.array(z.number()).optional().describe(t("TOOL_UPDATE_ISSUE_ATTACHMENT_ID", "Attachment IDs")),
  comment: z.string().optional().describe(t("TOOL_UPDATE_ISSUE_COMMENT", "Comment to add when updating the issue")),
}));

export const updateIssueTool = (backlog: Backlog, { t }: TranslationHelper): ToolDefinition<ReturnType<typeof updateIssueSchema>, Output> => {
  return {
    name: "update_issue",
    description: t("TOOL_UPDATE_ISSUE_DESCRIPTION", "Updates an existing issue"),
    schema: z.object(updateIssueSchema(t)),
    handler: async ({ issueIdOrKey, ...params }) => {
      const issue = await backlog.patchIssue(issueIdOrKey, params);
      
      return {
        content: [{ type: "text", text: JSON.stringify(issue, null, 2) }]
      };
    }
  };
};
