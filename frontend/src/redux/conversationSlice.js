import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",

  initialState: {
    conversations: [],
    selectedConversation: null,
  },

  reducers: {
    // Store all fetched conversations
    setConversation: (state, action) => {
      state.conversations = Array.isArray(action.payload) ? action.payload : [];
    },

    // Add a newly created conversation
    addConversation: (state, action) => {
      const newConversation = action.payload;
      if (!newConversation || !newConversation._id) return;

      if (!Array.isArray(state.conversations)) {
        state.conversations = [];
      }

      // Prevent duplicate conversations
      const alreadyExists = state.conversations.some(
        (conversation) =>
          conversation?._id === newConversation._id
      );

      if (!alreadyExists) {
        state.conversations.unshift(newConversation);
      }
    },

    // Select one conversation
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
  },
});

export const {
  setConversation,
  addConversation,
  setSelectedConversation,
} = conversationSlice.actions;

export default conversationSlice.reducer;
