import { searchTool } from "../config/tavily"

export const searchAgent= async (params) => {
    try {
        const results=await searchTool.invole({
            query:state.prompt
        })
        console.log(results)
        return {
            ...state,
            searchResults:results,
            images:results.images
        }
    } catch(error) {
        return {
            ...state,
            searchResults:[],
            images:[]
        }
    }
}