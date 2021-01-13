import React, { useState } from "react";
import { Box, Button, Grid, Text } from "grommet";
import { Trash, View } from "grommet-icons";
import moment from "moment";
import API from "../../utils/API";

function ProfileSnippet ({ snippet, viewerIsOwner, ...props }) {
  const [visible, setVisibility] = useState(true);
  return visible && <Grid rows={['xsmall', 'small']}
    columns={[['small', 'medium'], 'xsmall']}
    gap={{ column: "small", row: "none" }}
    areas={[
      { name: 'header', start: [0, 0], end: [0, 0] },
      { name: 'nav', start: [1, 0], end: [1, 0] },
      { name: 'main', start: [0, 1], end: [1, 1] },
    ]}
    margin={"small"}
    style={{ borderRadius: "1rem", border: "solid 1px rgba(0,0,0,0.33)" }}
    {...props}
  >
    <Box
      gridArea="header"
      background="brand"
      style={{ borderRadius: "1rem 0 0 0" }}
      pad={{ left: "1rem" }}
    >
      <Text>Language: {snippet.mode}</Text>
      <Text>Title: {snippet.title || "Untitled"}</Text>
    </Box>
    <Box gridArea="nav" direction="column" justify="center">
      <Button
        data-testid="editor-button"
        icon={<View />}
        label={`Editor`}
        href={`/editor/${snippet.mode}/${snippet._id}`}
      />
      <Button
        data-testid="delete-button"
        icon={<Trash />}
        label={`Delete`}
        disabled={!viewerIsOwner}
        onClick={() => {
          API.deleteCodeById(snippet._id);
          setVisibility(false);
        }}
      />
    </Box>
    <Box gridArea="main" direction="column" justify="between" pad="small" border="top">
      <Box>
        <Text size="small">First Line:</Text>
        <Text>{snippet.body[0]}</Text>
      </Box>
      <Text>Last Edited: {moment(snippet.lastEdited).local().fromNow().toString()}</Text>
    </Box>
  </Grid>
}

export default ProfileSnippet;