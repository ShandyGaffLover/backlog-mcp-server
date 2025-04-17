import { addIssueCommentTool } from "./addIssueComment.js";
import { jest, describe, it, expect } from '@jest/globals'; 
import type { Backlog } from "backlog-js";
import { createTranslationHelper } from "../createTranslationHelper.js";

describe("addIssueCommentTool", () => {
  const mockBacklog: Partial<Backlog> = {
    postIssueComments: jest.fn<() => Promise<any>>().mockResolvedValue({
      id: 3,
      content: "This is a new comment",
      changeLog: [],
      createdUser: {
        id: 1,
        userId: "admin",
        name: "Admin User",
        roleType: 1,
        lang: "en",
        mailAddress: "admin@example.com",
        lastLoginTime: "2023-01-01T00:00:00Z"
      },
      created: "2023-01-03T00:00:00Z",
      updated: "2023-01-03T00:00:00Z"
    })
  };

  const mockTranslationHelper = createTranslationHelper();
  const tool = addIssueCommentTool(mockBacklog as Backlog, mockTranslationHelper);

  it("returns created comment as formatted JSON text", async () => {
    const result = await tool.handler({
      issueIdOrKey: "TEST-1",
      content: "This is a new comment"
    });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("This is a new comment");
  });

  it("calls backlog.postIssueComments with correct params when using issue key", async () => {
    await tool.handler({
      issueIdOrKey: "TEST-1",
      content: "This is a new comment"
    });
    
    expect(mockBacklog.postIssueComments).toHaveBeenCalledWith("TEST-1", {
      content: "This is a new comment",
      notifiedUserId: undefined,
      attachmentId: undefined
    });
  });

  it("calls backlog.postIssueComments with correct params when using issue ID and notifications", async () => {
    await tool.handler({
      issueIdOrKey: 1,
      content: "This is a new comment with notifications",
      notifiedUserId: [2, 3]
    });
    
    expect(mockBacklog.postIssueComments).toHaveBeenCalledWith(1, {
      content: "This is a new comment with notifications",
      notifiedUserId: [2, 3],
      attachmentId: undefined
    });
  });

  it("calls backlog.postIssueComments with correct params when using attachments", async () => {
    await tool.handler({
      issueIdOrKey: "TEST-1",
      content: "This is a new comment with attachments",
      attachmentId: [1, 2]
    });
    
    expect(mockBacklog.postIssueComments).toHaveBeenCalledWith("TEST-1", {
      content: "This is a new comment with attachments",
      notifiedUserId: undefined,
      attachmentId: [1, 2]
    });
  });
});
