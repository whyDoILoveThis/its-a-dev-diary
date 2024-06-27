import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContent";
import { useState, useEffect } from "react";
import { GetData } from "../../firebase/getData";
import { Link } from "react-router-dom";
import UserCard from "../components/sub/UserCard";
import Navbar from "../components/main/NavBar";
import { MdOutlineDeleteForever } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { IoCheckmark } from "react-icons/io5";
import { FiDelete, FiEdit3 } from "react-icons/fi";
import {
  deleteDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "../../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ReactQuill from "react-quill";
import Loader from "../components/main/Loader";
import NavBar from "../components/main/NavBar";

const BlogPost = () => {
  const [showPop, setShowPop] = useState(false);
  const [isTheCreator, setIsTheCreator] = useState(false);
  const [creatorUid, setCreatorUid] = useState("");
  const [showEditPhoto, setShowEditPhoto] = useState(false);
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [showEditParagraphs, setShowEditParagraphs] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);
  const [title, setTitle] = useState("");
  const [paragraphs, setParagraphs] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(undefined);
  const [lastUpdatedDate, setLastUpdatedDate] = useState(undefined);

  const { id } = useParams();
  const { getUser } = useAuth();
  const user = getUser(); // Get current user
  const navigate = useNavigate();

  //Get Data
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const newData = await GetData();
      setData(newData);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // Retrieve the specific blog post data based on the id
  const blog = data.find((blog) => blog.id === id);

  useEffect(() => {
    setLoading(true);
    if (user && blog) {
      setCreatorUid(blog.creatorUid);
    }
    if (user !== null && user.uid === creatorUid) {
      setIsTheCreator(true);
    }
    setLoading(false);
  }, [user, creatorUid, blog]);

  const updateTitle = (blogData, info) => {
    const updatedBlogData = {
      ...blogData,
      title: info,
      lastUpdated: new Date(),
    };

    return updatedBlogData;
  };

  const updateParagraphs = (blogData, info) => {
    const updatedBlogData = {
      ...blogData,
      paragraphs: info,
      lastUpdated: new Date(),
    };

    return updatedBlogData;
  };

  const handleContentChange = (value) => {
    setParagraphs(value);
  };

  const handlUpdate = async (info, updateFunc) => {
    // Fetch blogs where creatorUid matches
    setLoading(true);
    const blogsRef = collection(firestore, "blogs");
    const q = query(blogsRef, where("id", "==", id));
    const querySnapshot = await getDocs(q);

    // Update the creator field if user.uid matches creatorUid
    querySnapshot.forEach(async (blogDoc) => {
      const blogData = blogDoc.data();
      if (user) {
        if (user.uid === creatorUid) {
          if (blogDoc.id) {
            console.log("running update for my blog", user.uid);
            const updatedBlogData = updateFunc(blogData, info);
            const blogDocRef = doc(firestore, "blogs", blogDoc.id);
            await updateDoc(blogDocRef, updatedBlogData);
            window.location.reload();
            setLoading(false);
          }
        }
      }
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setNewPhoto(e.target.files[0]);
    }
  };

  const updatePhoto = (blogData, info) => {
    const updatedBlogInfo = {
      ...blogData,
      photoUrl: info,
      lastUpdated: new Date(),
    };

    return updatedBlogInfo;
  };

  const handleUploadPhoto = async () => {
    setLoading(true);
    if (newPhoto === null) {
      setShowEditPhoto(false);
      setLoading(false);
    } else {
      const storageRef = ref(
        storage,
        `users/${user.uid}/updatedPhotos/${newPhoto.name}`
      );
      await uploadBytes(storageRef, newPhoto);
      const photoURL = await getDownloadURL(storageRef);
      setNewPhoto(photoURL);
      handlUpdate(photoURL, updatePhoto);
      setLoading(false);
      // Update user's profile with the new photo URL
    }
  };

  // Function to delete the blog post
  const handleDelete = async (idProperty) => {
    setLoading(true);
    try {
      // Query the collection to find the document with the matching ID property
      const q = query(
        collection(firestore, "blogs"),
        where("id", "==", idProperty)
      );
      const querySnapshot = await getDocs(q);

      // Iterate over the query snapshot to retrieve the document and its Firestore document name
      querySnapshot.forEach((document) => {
        // Get the name of the document
        const docName = document.id;
        // Get the reference to the document using its name
        const docRef = doc(firestore, "blogs", docName);

        // Delete the document using its name
        deleteDoc(docRef);
        console.log(
          `Blog post with ID property ${idProperty} deleted successfully`
        );
      });
      setLoading(false);
      navigate(`/user/${user.uid}`);
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  };

  const createMarkup = (htmlString) => {
    return { __html: htmlString };
  };

  //TODO: fix time minutes format EXAMPLE:Last Updated: Thursday, May 23, 2024 7:017pm

  useEffect(() => {
    if (blog) {
      const timestamp = blog?.createdAt;
      timestamp !== undefined &&
        setDate(
          new Date(
            timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6)
          )
        );

      const lastUpdated = blog?.lastUpdated;
      lastUpdated !== undefined &&
        setLastUpdatedDate(
          new Date(
            lastUpdated.seconds * 1000 +
              Math.floor(lastUpdated.nanoseconds / 1e6)
          )
        );
    }
  }, [blog]);

  if (loading || !blog) {
    return (
      <div>
        <NavBar />
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="post-img-wrap">
        {showEditPhoto ? (
          <div>
            <input className="mb-10" type="file" onChange={handleFileChange} />
            {showEditPhoto && isTheCreator && (
              <div className="flex gap-10 ml-10 mb-10">
                <button
                  onClick={() => {
                    setShowEditPhoto(false);
                  }}
                  className="creator-only-btn cancel-edit-btn"
                >
                  <FiDelete size={20} />
                </button>
                <button
                  onClick={handleUploadPhoto}
                  className="creator-only-btn"
                >
                  <IoCheckmark size={30} />
                </button>
              </div>
            )}
            {blog.photoURL !== null && blog.photoURL !== undefined ? (
              <div className="loading-skeleton"></div>
            ) : (
              <img
                src={
                  newPhoto !== null
                    ? URL.createObjectURL(newPhoto)
                    : blog.photoUrl
                }
                alt="Selected Photo"
                style={{ maxWidth: "300px" }}
              />
            )}
          </div>
        ) : (
          <img className="post-img" src={blog.photoUrl} alt="" />
        )}
        {isTheCreator && !showEditPhoto && (
          <button
            onClick={() => {
              setShowEditPhoto(true);
            }}
            className="creator-only-btn ml-10"
          >
            <FiEdit3 />
          </button>
        )}
      </div>
      <div className="flex flex-center flex-align gap-10">
        {showEditTitle ? (
          <input
            className="create-input"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            defaultValue={blog.title}
          />
        ) : (
          <div className="blog-dates">
            <div className="flex flex-center gap-10">
              <h2 className="post-title">{blog.title}</h2>
              <button
                onClick={() => {
                  setShowEditTitle(true);
                }}
                className="creator-only-btn"
              >
                <FiEdit3 />
              </button>
            </div>

            {date !== undefined && (
              <p className="m-0">
                <b>Written: </b>
                {date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                {date.getHours() % 12 || 12}:
                {(date.getMinutes() < 10 ? "0" : "") + date.getMinutes()}
                {date.getHours() < 12 ? "am" : "pm"}
              </p>
            )}
            {lastUpdatedDate !== undefined && (
              <p className="m-0 mb-10">
                <b>Last Updated: </b>
                {lastUpdatedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                {lastUpdatedDate.getHours() % 12 || 12}:
                {(lastUpdatedDate.getMinutes() < 10 ? "0" : "") +
                  date.getMinutes()}
                {lastUpdatedDate.getHours() < 12 ? "am" : "pm"}
              </p>
            )}
          </div>
        )}

        {isTheCreator && showEditTitle && (
          <div className="flex gap-10">
            <button
              onClick={() => {
                setShowEditTitle(false);
              }}
              className="creator-only-btn cancel-edit-btn"
            >
              <FiDelete size={20} />
            </button>
            <button
              onClick={() => {
                {
                  title === ""
                    ? setShowEditTitle(false)
                    : handlUpdate(title, updateTitle);
                }
              }}
              className="creator-only-btn"
            >
              <IoCheckmark size={30} />
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-align flex-between">
        <Link to={`/user/${blog.creatorUid}`}>
          <UserCard
            photo={blog.creatorPhotoUrl}
            name={blog.creator}
            email={blog.creatorEmail}
          />
        </Link>
      </div>
      <div className="flex-col col-align">
        {showEditParagraphs ? (
          <ReactQuill
            className="mb-10"
            theme="snow"
            defaultValue={blog.paragraphs}
            onChange={handleContentChange}
            placeholder="Write something..."
          />
        ) : (
          <div
            className=" post-content link-hover-purple"
            dangerouslySetInnerHTML={createMarkup(blog.paragraphs)}
          ></div>
        )}

        {user !== null && user.uid === blog.creatorUid && (
          <div className="flex items-center">
            {isTheCreator && !showEditParagraphs ? (
              <button
                onClick={() => {
                  setShowEditParagraphs(true);
                }}
                className="creator-only-btn paragraph-edit-btn"
              >
                <FiEdit3 />
              </button>
            ) : (
              isTheCreator &&
              showEditParagraphs && (
                <div className="flex gap-10 mb-10">
                  <button
                    onClick={() => {
                      setShowEditParagraphs(false);
                    }}
                    className="creator-only-btn cancel-edit-btn"
                  >
                    <FiDelete size={20} />
                  </button>
                  <button
                    onClick={() => {
                      paragraphs === ""
                        ? setShowEditParagraphs(false)
                        : handlUpdate(paragraphs, updateParagraphs);
                    }}
                    className="creator-only-btn"
                  >
                    <IoCheckmark size={30} />
                  </button>
                </div>
              )
            )}
            <button
              className="delete-btn"
              onClick={() => {
                setShowPop(true);
              }}
            >
              <MdOutlineDeleteForever size={20} color="red" />
            </button>
          </div>
        )}
      </div>
      {showPop && (
        <span className="pop-up flex-col col-center col-align">
          <article className="pop-up-content">
            <button
              className="close"
              onClick={() => {
                setShowPop(false);
              }}
            >
              <TiDelete size={40} />
            </button>
            <h2>This action cannot be undone!</h2>
            <div className="flex flex-center flex-align gap-100">
              {" "}
              <button
                className="deny"
                onClick={() => {
                  setShowPop(false);
                }}
              >
                <p className="deny-text">NO!</p>
              </button>
              <button className="confirm" onClick={() => handleDelete(id)}>
                <IoCheckmark size={30} />
              </button>
            </div>
          </article>
        </span>
      )}
      <div className="footer"></div>
    </div>
  );
};

export default BlogPost;
