import PropTypes from "prop-types";

const UserCard = ({ photo, name, email }) => {
  return (
    <div className="profile-card">
      <h2 className="flex flex-center flex-align gap-10">
        <img className="profile-pic" src={photo} alt="" />
        {name}
      </h2>
      {email && <h3>Email: {email}</h3>}
      {/* Additional user information */}
    </div>
  );
};

UserCard.propTypes = {
  photo: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

export default UserCard;
