import { Code2, FileText, Globe, Image, MessageSquare, Mic, Paperclip, Presentation, Send, Zap } from "lucide-react";
import { useState } from "react";
import sendMessage from "../features/sendMessage";
import { useDispatch, useSelector } from "react-redux";
import { addMessages} from "../redux/messageSlice";
import { createConversation } from "../features/createConversation";
import {
  addConversation,
  setConvTitle,
  setSelectedConversation,
} from "../redux/conversationSlice";
import { updateConversation } from "../features/updateConversation";

function ChatInput() {
  const [value, setValue] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Auto")
  const [isSending, setIsSending] = useState(false);
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  const handleSendMessage = async () => {
    if (!value.trim() || isSending) return;
    setIsSending(true);

    let conversation = selectedConversation;
    if (!conversation) {
      const conv = await createConversation();
      conversation = { ...conv, isNew: true };
      dispatch(addConversation(conv));
      dispatch(setSelectedConversation(conversation));
    }

    if (conversation?.title === "New Chat") {
      const newTitle = value.trim().slice(0, 40);
      await updateConversation({ id: conversation?._id, title: newTitle });
      dispatch(
        setConvTitle({
          conversationId: conversation._id,
          title: newTitle,
        }),
      );
    }

    const userMessage = value.trim();
    const payload = {
      prompt: userMessage, conversationId: conversation?._id, agent:selectedAgent.toLowerCase()
    }
    dispatch(addMessages({ role: "user", content: userMessage }));
    setValue("");

    // Agent backend handles saving both messages to DB
    const data = await sendMessage(payload);
    if (data) {
      const assistantContent =
        typeof data === "string"
          ? data
          : data.content || data.answer || data.aiResponse || data.message || "";
      dispatch(
        addMessages({
          role: "assistant",
          content: assistantContent,
          images: data.images || [],
        }),
      );
    } else {
      dispatch(addMessages({ role: "assistant", content: "Sorry, I encountered an error while processing your request. Please try again." }));
    }

    setIsSending(false);
  };

  const agents = [
    {
      id:"auto",
      icon:Zap,
      label:"Auto"
    },
    {
      id:"chat",
      icon:MessageSquare,
      label:"Chat"
    },
    {
      id:"coding",
      icon:Code2,
      label:"Coding"
    },
    {
      id:"pdf",
      icon:FileText,
      label:"PDF"
    },
    {
      id:"ppt",
      icon:Presentation,
      label:"PPT"
    },
    {
      id:"image",
      icon:Image,
      label:"Image"
    },
    {
      id:"search",
      icon:Globe,
      label:"Search"
    }
  ]
  return (
    <div className="w-full overflow-hidden px-3 md:px-3 py-5 border-t border-white/[0.06] bg-[#0d0f14]">
      <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">

        <div className='flex w-[80%] gap-2 flex-wrap'>
          {agents.map((agent)=>{
            const isActive=selectedAgent===agent.label
            const Icon=agent.icon
            return (
              <div 
              onClick={()=>setSelectedAgent(agent.label)}
              className={`
                flex
                flex-shrink-0
                cursor-pointer
                items-center
                gap-1.5
                px-3
                py-2
                rounded-full
                text-xs
                font-medium
                border
                transition-all
                ${
                  //  from-indigo-950 to-teal-950
                  isActive
                    ? "bg-gradient-to-r from-[#3d6649] to-[#fca606] text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                    : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"
                }
                `}>
                  <Icon size={14}
                  className={
                    isActive
                    ? "text-white"
                    : "text-slate-500"
                  } />

                  {agent.label}
                </div>
            )
          })}
        </div>

        <textarea
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          value={value}
          placeholder="Ask Anything..."
          disabled={isSending}
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
          rows={3}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer">
              <Paperclip size={16} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer">
              <Mic size={16} />
            </button>
          </div>

          <button
            disabled={!value.trim() || isSending}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 mb-1.5 rounded-lg border-none cursor-pointer transition-all duration-150 ${value.trim() ? "bg-linear-to-br from-indigo-950 to-teal-950 hover:opacity-90 text-white" : "bg-white/[0.05] text-slate-600 cursor-not-allowed"} `}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
