import { searchTool } from "../config/tavily.js";

export const searchAgent = async (state) => {
  try {
    const results = await searchTool.invoke({
      query: state.prompt,
    });

    console.log(results);

    const rawImages = Array.isArray(results?.images) ? results.images : [];
    const images = rawImages
      .map((img) => (typeof img === "string" ? img : img?.url))
      .filter((url) => typeof url === "string" && url.startsWith("http"));

    return {
      ...state,
      searchResults: results,
      images,
    };
  } catch (error) {
    console.error("Search Agent Error:", error);

    return {
      ...state,
      searchResults: [],
      images: [],
    };
  }
};