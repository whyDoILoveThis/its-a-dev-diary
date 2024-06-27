import { useState } from "react";
import {
  auth,
  storage,
  updateEmail,
  updatePassword,
  updateProfile,
} from "../../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import NavBar from "../components/main/NavBar";

const UserProfileSettings = () => {
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);

  const handleUpdateDisplayName = async () => {
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, { displayName: newDisplayName })
        .then(() => console.log("Display name updated successfully!"))
        .catch((error) => console.error("Error updating display name:", error));
    }
  };

  const handleUpdateEmail = () => {
    const user = auth.currentUser;
    if (user) {
      updateEmail(user, newEmail)
        .then(() => console.log("Email updated successfully!"))
        .catch((error) => console.error("Error updating email:", error));
    }
  };

  const handleUpdatePassword = () => {
    const user = auth.currentUser;
    if (user) {
      updatePassword(user, newPassword)
        .then(() => console.log("Password updated successfully!"))
        .catch((error) => console.error("Error updating password:", error));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setNewPhoto(e.target.files[0]);
    }
  };

  const handleUploadPhoto = async () => {
    if (newPhoto !== null) {
      const storageRef = ref(
        storage,
        `users/${auth.currentUser.uid}/profilePhoto/${newPhoto.name}`
      );
      await uploadBytes(storageRef, newPhoto);
      const photoURL = await getDownloadURL(storageRef);
      setNewPhoto(photoURL);
      // Update user's profile with the new photo URL
      updateProfile(auth.currentUser, { photoURL })
        .then(() => {
          console.log("Photo updated successfully!");
          window.location.reload();
        })
        .catch((error) => console.error("Error updating photo:", error));
    }
  };

  return (
    <div>
      <NavBar />
      <article className="settings">
        <h1> Profile Settings</h1>
        <div className="profile-info">
          <h2 className="flex flex-center gap-10">
            <img
              className="profile-pic"
              src={auth.currentUser.photoURL}
              alt=""
            />
            {auth.currentUser.displayName}
          </h2>
          <h3>Email: {auth.currentUser.email}</h3>
        </div>
        <form className="my-form">
          <div className="flex-col col-center gap-20">
            <input
              className="settings-input"
              type="text"
              value={newDisplayName}
              placeholder="Display Name"
              onChange={(e) => setNewDisplayName(e.target.value)}
            />
            <button type="submit" onClick={handleUpdateDisplayName}>
              Update Display Name
            </button>
          </div>
          <div className="flex-col col-center gap-20">
            <input
              className="settings-input"
              type="email"
              value={newEmail}
              placeholder="Email"
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <button onClick={handleUpdateEmail}>Update Email</button>
          </div>
          <div className="flex-col col-center gap-20">
            <input
              className="settings-input"
              type="password"
              value={newPassword}
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleUpdatePassword}>Update Password</button>
          </div>
          <div className="flex-col col-center gap-20">
            <div>
              <label>Change Profile Photo:</label>
              <div className="flex-col col-center">
                {newPhoto && (
                  <div>
                    <img
                      src={URL.createObjectURL(newPhoto)}
                      alt="Selected Photo"
                      style={{ maxWidth: "200px" }}
                    />
                  </div>
                )}{" "}
                <input
                  className="settings-input settings-input-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <button type="button" onClick={handleUploadPhoto}>
              Upload Photo
            </button>
          </div>
        </form>
        <p>Some changes may need time to take effect.</p>
      </article>
      <div className="footer"></div>
    </div>
  );
};

export default UserProfileSettings;
