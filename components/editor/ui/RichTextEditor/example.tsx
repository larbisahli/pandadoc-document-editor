import { useState } from "react";
import RichTextEditor from ".";

function Example() {
  const [html, setHtml] = useState("<p><b>Hello</b> world</p>");
  return (
    <>
      <RichTextEditor value={html} onChange={setHtml} />
      <h4>Output HTML</h4>
      <pre>{html}</pre>
    </>
  );
}
