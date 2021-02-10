import React, { useState } from "react";
import { Button, Tip } from "grommet";
import { Clipboard } from "grommet-icons";

function ClipboardButton({ textContent }) {
  const [clipboardState, setClipboardState] = useState("");

  async function clipboardCopy(copyText) {
    try {
      await navigator.clipboard.writeText(copyText);
      setClipboardState("Copied to clipboard!");
    } catch (err) {
      setClipboardState("Failed to copy!");
    }
    setTimeout(() => setClipboardState(""), 4000)
  }

  return <Tip content={clipboardState} dropProps={{ align: { "left": "left", "top": "bottom" } }} plain={!clipboardState}>
    <Button icon={<Clipboard />}
      alignSelf="start"
      label="Copy to clipboard"
      plain
      onClick={() => clipboardCopy(textContent)}
    />
  </Tip>
}

export default ClipboardButton;