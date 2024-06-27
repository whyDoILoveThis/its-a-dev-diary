import { useState } from "react";
import { useAuth } from "../context/AuthContent";
import { storage, firestore } from "../../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import NavBar from "../components/main/NavBar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import Loader from "../components/main/Loader";

//import { v4 as uuidv4 } from 'uuid';

const CreateBlog = () => {
  const { getUser } = useAuth();
  const user = getUser(); // Get current user
  const [photo, setPhoto] = useState(null);
  const [title, setTitle] = useState("");
  const [paragraphs, setParagraphs] = useState("");
  const [loading, setLoading] = useState(false);
  // Generate a unique ID for the blog post
  const blogId = uuidv4();
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleContentChange = (value) => {
    setParagraphs(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Upload photo to Firebase Storage
    const photoRef = ref(storage, `users/${user.uid}/blogImages/${blogId}`);
    await uploadBytes(photoRef, photo); // Assuming you are using uploadBytes or put method
    const photoUrl = await getDownloadURL(photoRef);

    if (user !== null) {
      try {
        const docRef = await addDoc(collection(firestore, `blogs`), {
          creator: user.displayName,
          creatorUid: user.uid,
          creatorEmail: user.email,
          creatorPhotoUrl: user.photoURL,
          id: blogId,
          title: title,
          paragraphs: paragraphs,
          photoUrl: photoUrl,
          createdAt: new Date(),
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.log("😡err adding document", e);
      }
    }

    // Reset form fields
    setPhoto(null);
    setTitle("");
    setParagraphs("");
    setLoading(false);
    navigate("/");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <NavBar />
      <div className="spacer"></div>
      <form className="my-form" onSubmit={handleSubmit}>
        {photo && (
          <img
            src={URL.createObjectURL(photo)}
            alt="Selected Photo"
            style={{ maxWidth: "200px" }}
          />
        )}
        <input type="file" onChange={handlePhotoChange} />
        <input
          className="create-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <ReactQuill
          theme="snow"
          value={paragraphs}
          onChange={handleContentChange}
          placeholder="Write something..."
        />

        <button type="submit">Submit</button>
      </form>
      <div className="footer"></div>
    </>
  );
};
export default CreateBlog;
