import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
//import { auth } from "../firebase/firebaseConfig";
import CreateBlog from "./pages/CreateBlog";
import BlogPost from "./pages/BlogPost";
import UserProfilePage from "./pages/UserProfilePage";
import UserProfileSettings from "./pages/UserProfileSettings";
//import { useNavigate } from "react-router-dom";

function App() {
  //const navigate = useNavigate();
  //if(!user) { navigate('/')}
  //const user = auth.currentUser;

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/user/:creatorUid" element={<UserProfilePage />} />
          <Route path="/user/settings" element={<UserProfileSettings />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
