import { useState } from "react";
import { useAuth } from "../context/AuthContent";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import NavBar from "../components/main/NavBar";
import Loader from "../components/main/Loader";

const SignIn = () => {
  const { getUser, loginWithGoogle, login, signUp } = useAuth();
  const user = getUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createAccount, setCreateAccount] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  console.log(email, password);

  if (user) {
    navigate("/");
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <article>
      <NavBar />
      <div className="sign-in">
        {createAccount && (
          <div>
            <form
              className="account-form"
              onSubmit={(e) => {
                e.preventDefault();
                setLoading(true);
                signUp(email, password);
              }}
            >
              <h2>Sign Up</h2>
              <div className="flex-col">
                <label>Email:</label>
                <input
                  className="settings-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex-col">
                <label>Password:</label>
                <input
                  className="settings-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Sign Up</button>
            </form>
            <p className="link-hover-purple">
              Already have an account?{" "}
              <Link onClick={() => setCreateAccount(false)}>Sign In</Link>
            </p>
          </div>
        )}
        {!createAccount && (
          <div>
            <form
              className="account-form"
              onSubmit={(e) => {
                e.preventDefault();
                setLoading(true);
                login(email, password);
              }}
            >
              <h2>Sign In</h2>
              <div className="flex-col">
                <label>Email:</label>
                <input
                  className="settings-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex-col">
                <label>Password:</label>
                <input
                  className="settings-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Sign In</button>
            </form>
            <p className="link-hover-purple">
              Don&#39;t have an account?{" "}
              <Link onClick={() => setCreateAccount(true)}>Sign Up</Link>
            </p>
          </div>
        )}
        <button
          className="flex"
          type="button"
          onClick={() => {
            setLoading(true);
            loginWithGoogle();
          }}
        >
          <FcGoogle /> oogle Login
        </button>
      </div>
    </article>
  );
};

export default SignIn;
