import {
  loadChatMessages,
  saveChatMessages,
} from "@/features/ai/actions/chat-store";
import { getChatModel } from "@/features/ai/utils/model";
import { requireUser } from "@/features/auth/action/require-user";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  convertToModelMessages,
  createIdGenerator,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/data/system-prompt";
import { tools } from "@/features/ai/tools/tool";

export async function POST(request: NextRequest) {
  try {
    await auth.protect();
    const { message, id }: { message: UIMessage; id: string } =
      await request.json();

    if (!message || !id) {
      return NextResponse.json(
        { error: "Missing message or id" },
        { status: 400 },
      );
    }

    const user = await requireUser();

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    const previousMessages = await loadChatMessages(id);

    const alreadySaved = previousMessages.some(
      (storedMessage) => storedMessage.id === message.id,
    );

    const messages = alreadySaved
      ? previousMessages
      : [...previousMessages, message];

    if (!alreadySaved) {
      await saveChatMessages(id, [message]);
    }

    const result = streamText({
      model: getChatModel(conversation.model),
      system: SYSTEM_PROMPT ?? "You are AskGpt , a helpful assistant",
      messages: await convertToModelMessages(messages),
      tools,
      // Allow the model to call a tool, see its result, and respond in the
      // same turn (up to 5 total steps) instead of stopping after one call.
      stopWhen: stepCountIs(5),
    });

    result.consumeStream({
      onError: (error) => {
        console.error("Error while consuming stream:", error);
      },
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        originalMessages: messages,
        generateMessageId: createIdGenerator({ prefix: "msg", size: 16 }),
        onError: (error) => {
          console.error("Error while streaming response:", error);
          // Keep the raw provider error out of the client-facing message —
          // this is what shows up as the assistant's reply if the model
          // (or Groq's API) fails mid-turn, e.g. the known Groq/gpt-oss
          // "Tool choice is none, but model called a tool" 400.
          return "Sorry, something went wrong generating a response. Please try again.";
        },
        onEnd: async ({ messages: finalMessages }) => {
          try {
            await saveChatMessages(id, finalMessages, { updateTitle: false });
          } catch (error) {
            console.error(error);
          }
        },
      }),
    });
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
