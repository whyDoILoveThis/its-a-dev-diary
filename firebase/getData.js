import { firestore } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";


export const GetData = async () => {

    const querySnapshot = await getDocs(
      collection(firestore, `blogs`)
    );

    const newData = [];
    querySnapshot.forEach((doc) => {
      newData.push(doc.data());
    });
    return newData;
  };

