import { useEffect, useState } from "react";
import { firestore } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import NavBar from "../components/main/NavBar";
import UserCard from "../components/sub/UserCard";
import BlogCard from "../components/sub/BlogCard";
import Loader from "../components/main/Loader";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [blogs, setAllBlogs] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllBlogs, setShowAllBlogs] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsCollectionRef = collection(firestore, "blogs");
        const blogsSnapshot = await getDocs(blogsCollectionRef);
        const blogData = [];
        blogsSnapshot.forEach((doc) => {
          blogData.push(doc.data());
        });
        setAllBlogs(blogData);
        const allUsers = blogsSnapshot.docs.map((doc) => ({
          creatorUid: doc.data().creatorUid,
          creator: doc.data().creator,
          creatorEmail: doc.data().creatorEmail,
          creatorPhotoUrl: doc.data().creatorPhotoUrl,
          // You can add more user info here like displayName, email, etc.
        }));
        // Filter out duplicate users
        const uniqueUsers = Array.from(
          new Set(allUsers.map((user) => user.creatorUid))
        ).map((creatorUid) =>
          allUsers.find((user) => user.creatorUid === creatorUid)
        );
        setUsers(uniqueUsers);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <NavBar />
      {/*!!!!!! USERS */}
      {showAllUsers && (
        <div className="flex-col col-align gap-20">
          <h1>All Users</h1>
          <div className="flex gap-10">
            <button
              className="btn-selected"
              onClick={() => {
                setShowAllUsers(true);
                setShowAllBlogs(false);
              }}
            >
              All Users
            </button>
            <button
              onClick={() => {
                setShowAllUsers(false);
                setShowAllBlogs(true);
              }}
            >
              All Blogs
            </button>
          </div>
          <ul className="flex-col col-align gap-20">
            {users.map((user) => (
              <Link to={`/user/${user.creatorUid}`} key={user.creatorUid}>
                <UserCard
                  photo={user.creatorPhotoUrl}
                  name={user.creator}
                  email={user.creatorEmail}
                />
              </Link>
            ))}
          </ul>
          <div className="footer"></div>
        </div>
      )}
      {showAllBlogs && (
        <div className="flex-col col-align gap-20">
          {/*!!!! BLOGS */}
          <h1>All Blogs</h1>
          <div className="flex gap-10">
            <button
              onClick={() => {
                setShowAllUsers(true);
                setShowAllBlogs(false);
              }}
            >
              All Users
            </button>
            <button
              className="btn-selected"
              onClick={() => {
                setShowAllUsers(false);
                setShowAllBlogs(true);
              }}
            >
              All Blogs
            </button>
          </div>
          <ul className="flex flex-center flex-align flex-wrap gap-20">
            {blogs.map((blog, index) => (
              <div className="blog-card" key={blog.creatorUid}>
                <Link to={`/user/${blog.creatorUid}`}>
                  <li>
                    <div className="absolute-profile">
                      <UserCard
                        photo={blog.creatorPhotoUrl}
                        name={blog.creator}
                      />
                    </div>
                    <BlogCard
                      key={index}
                      id={blog.id}
                      img={blog.photoUrl}
                      title={blog.title}
                    />
                    {/* Additional user information */}
                  </li>
                </Link>
              </div>
            ))}
          </ul>
          <div className="footer"></div>
        </div>
      )}
    </div>
  );
};

export default Home;
