import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const BlogCard = ({ id, img, title }) => {
  const [timer, setTimer] = useState(true);

  const delayedCode = () => {
    setTimer(false);
  };

  useEffect(() => {
    setTimeout(delayedCode, 1500);
  }, []);
  return (
    <div>
      <Link to={`/blog/${id}`}>
        {timer ? (
          <div className="loading-skeleton"></div>
        ) : (
          <img className="blog-card-img" src={img} alt="" />
        )}
        <h2 className="blog-card-title">{title}</h2>
      </Link>
    </div>
  );
};

BlogCard.propTypes = {
  id: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default BlogCard;
