import { useEffect } from "react"
import Home from "./pages/Home"
import getCurrentUser from "./features/getCurrentUser"
import { useDispatch } from "react-redux"
import { setUserdata } from "./redux/userSlice"


function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await getCurrentUser();
        dispatch(setUserdata(data));
      } catch (error) {
        console.error("Failed to get current user:", error);
        dispatch(setUserdata(null));
      }
    };
    getUser();
  }, [dispatch]);

  return (
    <>
      <Home/>
    </>
  )
}

export default App
