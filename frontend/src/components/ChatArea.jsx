import Nav from './Nav.jsx'
import MessageList from './MessageList.jsx'
import ChatInput from './ChatInput.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import getMessages from '../features/getMessages.js'
import { setMessages } from '../redux/messageSlice.js'

function ChatArea() {
    const {selectedConversation} = useSelector(state=>state.conversation)
    const dispatch=useDispatch()
    useEffect(()=> {
        const getMesg=async() => {
            if(!selectedConversation?._id) {
                dispatch(setMessages([]))
                return
            }
            if(selectedConversation?.isNew) {
                return
            }
            const data=await getMessages(selectedConversation?._id)
            dispatch(setMessages(Array.isArray(data) ? data : []))
        }
        getMesg()
    },[selectedConversation?._id])
    return (
        <div className='flex-1 flex flex-col'>
            <Nav/>
            <MessageList/>
            <ChatInput/>
        </div>
    )
}

export default ChatArea