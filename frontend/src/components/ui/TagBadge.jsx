import React from 'react';
import { Link } from 'react-router-dom';

const TagBadge = ({ tag, clickable = true }) => {
  const content = (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
      {tag.name || tag}
    </span>
  );

  if (clickable) {
    return (
      <Link to={`/blog/tag/${tag.slug || tag}`}>
        {content}
      </Link>
    );
  }

  return content;
};

export default TagBadge;