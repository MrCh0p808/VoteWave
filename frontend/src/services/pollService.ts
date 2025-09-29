import apiClient from "./apiClient";
import { Poll } from "../types/poll";

export const fetchPolls = async (): Promise<Poll[]> => {
  const { data } = await apiClient.get("/polls");
  return data;
};

export const createPoll = async (poll: Omit<Poll, "id" | "createdAt">) => {
  const { data } = await apiClient.post("/poll", poll);
  return data;
};

export const voteOnPoll = async (pollId: string, optionId: string) => {
  const { data } = await apiClient.post(`/poll/${pollId}/vote`, { optionId });
  return data;
};
