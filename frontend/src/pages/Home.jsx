import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase.js";
import { FcGoogle } from "react-icons/fc";
import api from "../../utils/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { setUserdata } from "../redux/userSlice.js";

function Home() {
  const { userData } = useSelector((state) => state.user)
  const dispatch=useDispatch()
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", {token});
      dispatch(setUserdata(data))
    } catch (error) {
      console.log(error);
    }
  };
  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    console.log(token);
    await handleLogin(token);
    console.log(data);
  };
  return (
    <div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden">
      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">
                Welcome to KJ
              </h2>
              <p className="text-[13px] text-slate-400">
                Please login to continue using the app.
              </p>
            </div>
            <button
              className="w-full flex items-center justify-center gap-3 py-[11px] rounded-xl 
                    text-sm font-medium text-white bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-950
                    hover:from-slate-800 hover:via-indigo-900 hover:to-teal-900
                    border border-teal-500/30 hover:border-amber-400/50
                    shadow-lg shadow-teal-950/40 hover:shadow-amber-400/10
                    transition-all duration-200 cursor-pointer"
              onClick={googleLogin}
            >
              <FcGoogle size={18} />
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
