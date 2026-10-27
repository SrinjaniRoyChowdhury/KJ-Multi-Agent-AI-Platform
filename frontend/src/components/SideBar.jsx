import {
  Coins,
  LogOut,
  MessageSquare,
  PanelLeftDashedIcon,
  PenBoxIcon,
  Plus,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getConversations } from "../features/getConversations";
import { useDispatch, useSelector } from "react-redux";
import {
  setConversation,
  setSelectedConversation,
} from "../redux/conversationSlice";
import logOut from "../features/logOut";
import { setUserdata } from "../redux/userSlice";

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [imageError, setImageError] = useState(false);

  const dispatch = useDispatch();

  const { conversations = [], selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const { userData, loading } = useSelector((state) => state.user);
  const userId = userData?._id || userData?.userId;

  // Fetch conversations whenever user logs in or page refreshes
  useEffect(() => {
    if (!userId) {
      dispatch(setConversation([]));
      dispatch(setSelectedConversation(null));
      return;
    }

    const fetchConversations = async () => {
      try {
        const response = await getConversations();

        const conversationList = Array.isArray(response)
          ? response
          : response?.conversations || [];

        dispatch(setConversation(conversationList));
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };

    fetchConversations();
  }, [userId, dispatch]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(setUserdata(null));
      dispatch(setConversation([]));
      dispatch(setSelectedConversation(null));
    }
  };

  // Select an existing conversation
  const handleSelectConversation = (conversation) => {
    dispatch(setSelectedConversation(conversation));
  };

  // Start a new chat without creating an empty conversation
  const handleNewChat = () => {
    dispatch(setSelectedConversation(null));
  };

  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-50 h-screen shrink-0
      bg-[#0d0f14] border-r border-white/[0.06] transition-all duration-200
      ${collapsed ? "w-[72px]" : "w-[270px]"}`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]">
          <button
            type="button"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex items-center justify-center w-7 h-7
            rounded-lg text-slate-500 hover:text-slate-200
            hover:bg-white/[0.05] transition-colors bg-transparent
            border-none cursor-pointer"
            onClick={() => setCollapsed((previous) => !previous)}
          >
            <PanelLeftDashedIcon size={18} />
          </button>

          {!collapsed && (
            <>
              <span className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1">
                KJ
              </span>

              <span
                className="text-[10px] font-medium text-indigo-400
                bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5
                rounded-full tracking-wide"
              >
                free
              </span>

              <button
                type="button"
                title="New chat"
                onClick={handleNewChat}
                className="flex items-center justify-center w-7 h-7
                rounded-lg text-slate-500 hover:text-slate-200
                hover:bg-white/[0.05] transition-colors bg-transparent
                border-none cursor-pointer"
              >
                <PenBoxIcon size={14} />
              </button>
            </>
          )}
        </div>

        {/* New Chat */}
        <div className="px-3 pt-4 pb-1">
          <button
            type="button"
            onClick={handleNewChat}
            title="New Chat"
            className={`w-full flex items-center justify-center gap-2
            text-sm font-medium text-white
            bg-gradient-to-r from-indigo-950 to-teal-950
            rounded-xl py-[10px] border-none cursor-pointer
            hover:opacity-90 transition-opacity duration-150
            ${collapsed ? "px-0" : "px-3"}`}
          >
            <Plus size={15} />
            {!collapsed && "New Chat"}
          </button>
        </div>

        {/* Conversation heading */}
        {!collapsed && (
          <div
            className="px-5 pt-4 pb-1.5 text-[10.5px]
            font-semibold uppercase tracking-widest text-slate-600"
          >
            {conversations.length === 0
              ? "No Recent Conversations"
              : "Recents"}
          </div>
        )}

        {/* Conversation list */}
        <div
          className="flex-1 overflow-y-auto px-2.5 pb-2
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {conversations.map((conversation, index) => {
            const isActive =
              selectedConversation?._id != null &&
              String(selectedConversation._id) ===
                String(conversation?._id);

            return (
              <button
                type="button"
                key={conversation?._id || index}
                title={conversation?.title || "New Chat"}
                onClick={() => handleSelectConversation(conversation)}
                className={`w-full flex items-center gap-2.5
                text-left mb-0.5 px-2.5 py-2 rounded-[10px]
                transition-colors duration-150 cursor-pointer
                ${
                  isActive
                    ? "bg-indigo-500/20"
                    : "bg-transparent border-transparent hover:bg-white/[0.05]"
                }`}
              >
                <span
                  className={`flex items-center justify-center shrink-0
                  w-[28px] h-[28px] rounded-lg
                  ${isActive ? "text-yellow-300" : "text-slate-400"}`}
                >
                  <MessageSquare size={14} />
                </span>

                {!collapsed && (
                  <span
                    className={`text-[13px] font-medium truncate
                    ${isActive ? "text-slate-100" : "text-slate-300"}`}
                  >
                    {conversation?.title || "New Chat"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Profile Section */}
        <div className="mt-auto">
          <div className="mx-2.5 h-px bg-white/[0.06]" />

          <div
            className={`flex ${
              collapsed ? "flex-col items-center" : "items-center"
            } gap-2 px-3 py-3`}
          >
            {loading ? (
              <div
                className={`flex items-center gap-2.5 min-w-0 flex-1 rounded-xl py-2 animate-pulse
                ${collapsed ? "justify-center" : ""}`}
              >
                <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] shrink-0" />

                {!collapsed && (
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="h-3 bg-white/[0.08] rounded w-20" />
                    <div className="h-2 bg-white/[0.04] rounded w-12" />
                  </div>
                )}
              </div>
            ) : userData ? (
              <>
                {/* Avatar and User Details */}
                <div
                  className={`flex items-center gap-2.5 min-w-0 flex-1 rounded-xl
                  py-2 ${collapsed ? "justify-center" : ""}`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {userData?.avatar && !imageError ? (
                      <img
                        className="w-9 h-9 rounded-[10px] object-cover
                        border-2 border-yellow-500/60"
                        src={userData.avatar}
                        alt="Profile"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div
                        className="w-9 h-9 rounded-[10px]
                        bg-white/[0.06] flex items-center justify-center"
                      >
                        <User size={17} className="text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  {!collapsed && (
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-slate-200 truncate">
                        {userData?.name || "User"}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-px">
                        Free Plan
                      </p>
                    </div>
                  )}
                </div>

                {/* Coins and Logout */}
                {!collapsed ? (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      title="Coins"
                      className="flex items-center justify-center w-8 h-8
                      rounded-lg border-none bg-transparent text-yellow-500
                      cursor-pointer hover:bg-white/[0.08] hover:text-yellow-400
                      transition-all duration-150"
                    >
                      <Coins size={18} />
                    </button>

                    <button
                      type="button"
                      title="Logout"
                      onClick={handleLogout}
                      className="flex items-center justify-center w-8 h-8
                      rounded-lg border-none bg-transparent text-slate-500
                      cursor-pointer hover:bg-white/[0.08] hover:text-red-400
                      transition-all duration-150"
                    >
                      <LogOut size={17} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    title="Logout"
                    onClick={handleLogout}
                    className="flex items-center justify-center w-8 h-8
                    rounded-lg border-none bg-transparent text-slate-500
                    cursor-pointer hover:bg-white/[0.08] hover:text-red-400
                    transition-all duration-150"
                  >
                    <LogOut size={16} />
                  </button>
                )}
              </>
            ) : (
              <div className="w-full text-center py-2 text-xs text-slate-500">
                Not logged in
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
