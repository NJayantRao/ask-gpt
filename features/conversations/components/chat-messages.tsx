"use client";

import { isTextUIPart, isToolUIPart, type UIMessage } from "ai";
import type { ChatStatus } from "ai";

import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { Loader } from "@/components/ai-elements/loader";

type ChatMessagesProps = {
  messages: UIMessage[];
  status: ChatStatus;
};

export function ChatMessages({ messages, status }: ChatMessagesProps) {
  const isWaiting = status === "submitted" && messages.at(-1)?.role === "user";

  return (
    <Conversation>
      <ConversationContent className="py-8">
        {messages.map((message) => (
          <Message key={message.id} from={message.role}>
            <MessageContent>
              {message.parts.map((part, index) => {
                if (isTextUIPart(part)) {
                  return (
                    <MessageResponse key={`${message.id}-text-${index}`}>
                      {part.text}
                    </MessageResponse>
                  );
                }

                if (isToolUIPart(part)) {
                  return (
                    <Tool
                      key={part.toolCallId ?? `${message.id}-tool-${index}`}
                    >
                      <ToolHeader type={part.type} state={part.state} />
                      <ToolContent>
                        <ToolInput input={part.input} />
                        {(part.state === "output-available" ||
                          part.state === "output-error") && (
                          <ToolOutput
                            output={
                              part.state === "output-available"
                                ? part.output
                                : undefined
                            }
                            errorText={
                              part.state === "output-error"
                                ? part.errorText
                                : undefined
                            }
                          />
                        )}
                      </ToolContent>
                    </Tool>
                  );
                }

                return null;
              })}
            </MessageContent>
          </Message>
        ))}

        {isWaiting ? (
          <Message from="assistant">
            <MessageContent>
              <Loader />
            </MessageContent>
          </Message>
        ) : null}
      </ConversationContent>
    </Conversation>
  );
}
