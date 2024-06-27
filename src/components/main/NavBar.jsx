import Button from "../tiny/Button";
import { useAuth } from "../../context/AuthContent";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { BiHome } from "react-icons/bi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { PiGearFineBold } from "react-icons/pi";
import { MdLogout } from "react-icons/md";
import UserCard from "../sub/UserCard";

const NavBar = () => {
  const { getUser, signOut } = useAuth();

  const currentUser = getUser();
  console.log(currentUser);

  const [isLargeViewport, setIsLargeViewport] = useState(
    window.innerWidth >= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsLargeViewport(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array

  return (
    <article className="nav-wrap">
      {isLargeViewport ? (
        <div className="nav">
          <div className="nav-links">
            <Link to={"/"}>
              {" "}
              <img width={40} src="/favicon.svg" alt="" />
            </Link>
            <Link to={"/"}>All Blogs</Link>
            {currentUser && <Link to={"/create"}>Create</Link>}{" "}
          </div>
          {currentUser !== null && (
            <Link className="nav-user" to={`/user/${currentUser.uid}`}>
              <UserCard
                photo={currentUser.photoURL}
                name={currentUser.displayName}
              />
            </Link>
          )}
          <div className="nav-btns">
            {!currentUser && (
              <Link to={"/signIn"}>
                <Button text="sign in" color="green" />
              </Link>
            )}
            {currentUser && (
              <Link to={"/user/settings"}>
                <button>
                  <PiGearFineBold size={20} />
                </button>
              </Link>
            )}
            {currentUser && (
              <button onClick={() => signOut()}>
                <MdLogout size={20} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="nav nav-mobile">
          {currentUser !== null && (
            <Link className="user" to={`/user/${currentUser.uid}`}>
              <img
                src={currentUser !== null && currentUser.photoURL}
                alt="profile photo"
                className="profile-pic"
              />
            </Link>
          )}
          <Link to={"/"}>
            <BiHome size={40} />
          </Link>
          {currentUser && (
            <Link to={"/create"}>
              <AiOutlinePlusCircle size={40} />
            </Link>
          )}
          {!currentUser && (
            <Link to={"/signIn"}>
              <Button text="sign in" color="green" />
            </Link>
          )}
          {currentUser && (
            <Link to={"/user/settings"}>
              <PiGearFineBold size={40} />
            </Link>
          )}
          {currentUser && (
            <div onClick={() => signOut()}>
              <MdLogout size={40} />
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default NavBar;
