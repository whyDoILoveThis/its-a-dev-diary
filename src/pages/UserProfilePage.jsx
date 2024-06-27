import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import NavBar from "../components/main/NavBar";
import BlogCard from "../components/sub/BlogCard";
import { useAuth } from "../context/AuthContent";
import UserCard from "../components/sub/UserCard";
import updateUserInfo from "../../firebase/updateUserInfo";
import { firestore } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import Loader from "../components/main/Loader";
import { IoCheckmark } from "react-icons/io5";
import { FiDelete, FiEdit3 } from "react-icons/fi";
import { getBio } from "../../firebase/getBio";

const UserProfilePage = () => {
  const { creatorUid } = useParams();
  const [userBlogs, setUserBlogs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [hasNoBlogs, setHasNoBlogs] = useState(false);
  const [isBigPic, setIsBigPic] = useState(false);
  const [bio, setBio] = useState("");
  const [bioData, setBioData] = useState("");
  const [isTimeToUpdateBio, setIsTimeToUpdateBio] = useState(false);
  const { getUser } = useAuth();
  const user = getUser();

  useEffect(() => {
    updateUserInfo(
      user,
      creatorUid,
      setUserProfile,
      setHasNoBlogs,
      setUserBlogs
    );
  }, [user, creatorUid]);

  useEffect(() => {
    const fetchBio = async () => {
      if (creatorUid !== undefined) {
        try {
          const bioStuff = await getBio(creatorUid);
          setBioData(bioStuff?.bio || ""); // Set bio or an empty string if not found
        } catch (error) {
          console.error("Error fetching bio:", error);
          setBioData("");
        }
      }
    };

    fetchBio();
  }, [user, creatorUid, isTimeToUpdateBio]);

  if (!userProfile && !hasNoBlogs) {
    return <Loader />;
  } else if (hasNoBlogs) {
    return (
      <div>
        <NavBar />
        Please create your first blog to view this page{" "}
        <Link to={"/create"}>
          <button>Create</button>
        </Link>
      </div>
    );
  }

  console.log(bioData, "biooooo");

  return (
    <div>
      <NavBar />
      <div className="m-20">
        {!showProfile ? (
          <div
            onClick={() => {
              setShowProfile(true);
            }}
            className="profile-user-card"
          >
            <UserCard
              photo={userProfile.creatorPhotoUrl}
              name={userProfile.creator}
              email={userProfile.creatorEmail}
            />
          </div>
        ) : (
          <div className="profile-card-bg flex-col col-align">
            <div className="flex flex-center gap-10">
              <button
                className="absolute profile-close"
                onClick={() => {
                  setShowProfile(false);
                  console.log(showProfile);
                }}
              >
                X
              </button>
              <img
                onClick={() => {
                  setIsBigPic(!isBigPic);
                }}
                className={`profile-pic ${isBigPic && "profile-pic-lg"}`}
                src={userProfile.creatorPhotoUrl}
                alt="Profile Photo"
              />
              <h2>{userProfile.creator}</h2>
            </div>
            <p>
              <b>Email: </b>
              {userProfile.creatorEmail}
            </p>

            <form
              className={`${!isTimeToUpdateBio ? "hidden" : "block"}`}
              onSubmit={async (e) => {
                e.preventDefault();
                const bioRef = doc(firestore, `bio/${user.uid}`);
                await setDoc(bioRef, {
                  bio: bio,
                  uid: userProfile.creatorUid,
                });
              }}
            >
              <input
                style={{ width: "fit-content" }}
                className="create-input"
                type="text"
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                }}
              />
              <div className="flex gap-10 m-10">
                <button
                  type="button"
                  onClick={() => {
                    setIsTimeToUpdateBio(false);
                  }}
                  className="creator-only-btn cancel-edit-btn"
                >
                  <FiDelete size={20} />
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    setIsTimeToUpdateBio(false);
                  }}
                  className="creator-only-btn"
                >
                  <IoCheckmark size={30} />
                </button>
              </div>
            </form>

            <div className="flex flex-align gap-10 mb-10">
              <p>
                <b>Bio: </b>
                {bioData}
              </p>
              {!isTimeToUpdateBio && user?.uid === creatorUid && (
                <button
                  className="creator-only-btn"
                  onClick={() => {
                    setIsTimeToUpdateBio(true);
                  }}
                >
                  <FiEdit3 />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex-col col-align">
        <h2>
          {user !== null && user !== undefined && user.uid === creatorUid
            ? "My Blogs"
            : `${userProfile.creator}'s Blogs`}
        </h2>
      </div>
      <ul className="flex flex-center flex-wrap">
        {userBlogs.map((blog, index) => (
          <div className="blog-card" key={index}>
            <BlogCard
              id={blog.id}
              img={blog.photoUrl}
              title={blog.title}
              paragraphs={blog.paragraphs}
            />
          </div>
        ))}
      </ul>
      <div className="footer"></div>
    </div>
  );
};

export default UserProfilePage;
