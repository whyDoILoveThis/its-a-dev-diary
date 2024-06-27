
import { firestore } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";


const updateUserInfo = async (user, creatorUid, setUserProfile, setHasNoBlogs,setUserBlogs) => {
    try {
      // Fetch blogs where creatorUid matches
      const blogsRef = collection(firestore, "blogs");
      const q = query(blogsRef, where("creatorUid", "==", creatorUid));
      const querySnapshot = await getDocs(q);

      // Update the creator field if user.uid matches creatorUid
      querySnapshot.forEach((blogDoc) => {
        const blogData = blogDoc.data();
        if (user !== null && user !== undefined){
          if (user) {
          if (user.uid === creatorUid) {
            console.log("running update for blogs", user.uid);
            const updatedBlogData = {
              ...blogData,
              creator: user.displayName,
              creatorPhotoUrl: user.photoURL,
            };
            const blogDocRef = doc(firestore, "blogs", blogDoc.id);
            updateDoc(blogDocRef, updatedBlogData);
          }
        }}
      });
      // Extract user profile data from the first blog found
      const userData =
        querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data() : null;
      setUserProfile(userData);
      if (querySnapshot.docs.length <= 0) {
        setHasNoBlogs(true);
      }

      // Extract user's blogs from all matching blogs
      const userBlogsData = querySnapshot.docs.map((doc) => doc.data());
      setUserBlogs(userBlogsData);
    } catch (error) {
      console.error("Error fetching user blogs:", error);
    }
  };

  export default updateUserInfo