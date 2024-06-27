import { firestore } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";


export const GetAllUsers = async () => {

    const querySnapshot = await getDocs(
      collection(firestore, 'users')
    );

    const userData = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      userData.push(doc.data());
    });
    return userData;
  };
