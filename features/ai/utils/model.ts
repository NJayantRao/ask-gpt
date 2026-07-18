import { groq } from "@ai-sdk/groq";

export const DEFAULT_CHAT_MODEL = "openai/gpt-oss-20b";

export const getChatModel = (modelId?: string | null) => {
  return groq(modelId || DEFAULT_CHAT_MODEL);
};
