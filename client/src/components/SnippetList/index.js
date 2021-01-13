import React from "react";
import { Box } from "grommet";
import ProfileSnippet from "../ProfileSnippet";

function SnippetList({ data, viewerIsOwner }) {
  return <Box>
    {data.map(snippet => (
      <ProfileSnippet key={snippet._id} snippet={snippet} viewerIsOwner={viewerIsOwner} />
    ))}
  </Box>
}
export default SnippetList;