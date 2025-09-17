import React from "react";
import { DiscussionEmbed } from "disqus-react";

const DisqusComments = ({ postId, postTitle }) => {
  // Replace 'your-disqus-shortname' with your actual shortname from the Disqus admin panel
  const disqusShortname = "your-disqus-shortname";

  const disqusConfig = {
    url: `https://your-website.com/blog/${postId}`, // Make sure this URL is a consistent identifier for each post
    identifier: postId,
    title: postTitle,
  };

  return <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />;
};

export default DisqusComments;
