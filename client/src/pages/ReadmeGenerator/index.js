import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, Button, CheckBox, Form, FormField, Markdown, TextArea, TextInput } from "grommet";
import { Copy } from "grommet-icons";
import ClipboardButton from "../../components/ClipboardButton";

function ReadmeGenerator() {
  const history = useHistory();
  const [formState, setFormState] = useState({
    title: "",
    showContents: false,
    description: "",
    installation: "",
    usage: "",
    contributors: "",
    license: ""
  });

  const [previewState, setPreviewState] = useState("# Untitled");



  useEffect(() => {
    let outputText = `# ${formState.title ? formState.title : "Untitled"}`;
    const contentHeadings = Object.keys(formState)
      .filter(key => !["title", "description", "showContents"].includes(key))
      .filter(key => formState[key])
      .map(key => key.substring(0, 1).toUpperCase() + key.substring(1));
    outputText += `${formState.description ? `\n\n## Description\n${formState.description}` : ""}`
    outputText += `${formState.showContents && contentHeadings.length ? `\n\n## Table of Contents\n${parseContentsList(contentHeadings)}` : ""}`;
    outputText += `${formState.installation ? `\n\n## Installation\n${formState.installation}` : ""}`
    outputText += `${formState.usage ? `\n\n## Usage\n${formState.usage}` : ""}`
    outputText += `${formState.contributors ? `\n\n## Contributors\n${formState.contributors}` : ""}`
    outputText += `${formState.license ? `\n\n## License\n${formState.license}` : ""}`
    setPreviewState(outputText);
  }, [formState]);

  return <Box direction="row-responsive" alignContent="start" gap="small">
    <Box width={{min: "360px"}}>
      <Form value={formState} onChange={nextValue => setFormState(nextValue)} >
        <FormField label="Include Table of Contents" htmlFor="showContents">
          <CheckBox name="showContents" />
        </FormField>
        <FormField label="Project Name" htmlFor="title">
          <TextInput name="title" placeholder="Untitled" />
        </FormField>
        <FormField label="Description" htmlFor="description">
          <TextArea name="description" />
        </FormField>
        <FormField label="Project Installation" htmlFor="installation">
          <TextInput name="installation" />
        </FormField>
        <FormField label="Project Usage" htmlFor="usage">
          <TextInput name="usage" />
        </FormField>
        <FormField label="Project Contributors" htmlFor="contributors">
          <TextInput name="contributors" />
        </FormField>
        <FormField label="Project License" htmlFor="license">
          <TextInput name="license" />
        </FormField>
      </Form>
    </Box>
    <Box>
      <Box direction="row" alignContent="start">
        <Box gap="xxsmall">
          <Button alignSelf="start"
            icon={<Copy />}
            label="Edit as text"
            plain
            onClick={() => history.push("/editor/markdown", { code: previewState })}
          />
          <ClipboardButton textContent={previewState} />
        </Box>
      </Box>
      <Markdown>{previewState}</Markdown>
    </Box>
  </Box>
}

function parseContentsList(contents) {
  return contents
    .map((title, index) => `${index + 1}. [${title}](#${title})`)
    .join("\n");
}

export default ReadmeGenerator;
