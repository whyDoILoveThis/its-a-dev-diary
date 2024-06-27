import { firestore } from "../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

export const getBio = async (creatorUid) => {
    const bioRef = collection(firestore, 'bio');
const q = query(bioRef, where("uid", "==", creatorUid));

const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0].data()


}