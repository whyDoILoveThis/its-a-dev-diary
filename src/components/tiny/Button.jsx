import PropTypes from "prop-types";

const Button = ({ text, color, onClick }) => {
  return (
    <button onClick={onClick} className={`bg-[${color}]`}>
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Button;
