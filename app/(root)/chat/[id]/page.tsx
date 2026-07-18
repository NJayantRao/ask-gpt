import { loadChatMessages } from "@/features/ai/actions/chat-store";
import { getConversation } from "@/features/conversations/actions/conversation-actions";
import { ConversationView } from "@/features/conversations/components/conversation-view";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  try {
    await getConversation(id);
  } catch (error) {
    notFound();
  }

  const initialMessages = await loadChatMessages(id);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <ConversationView
        key={id}
        conversationId={id}
        initialMessages={initialMessages}
      />
    </div>
  );
};

export default page;