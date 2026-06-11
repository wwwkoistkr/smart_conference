/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SummaryLength = "short" | "medium" | "detailed";

export interface MeetingInput {
  title: string;
  participants: string;
  content: string;
  lengthOption: SummaryLength;
}

export interface ActionItem {
  task: string;
  assignee: string;
}

export interface SummaryOutput {
  headline: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
  copyText: string;
}

export interface SavedMeeting {
  id: string;
  createdAt: string;
  input: MeetingInput;
  output: SummaryOutput;
}
