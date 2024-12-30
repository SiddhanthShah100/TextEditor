import React, { useState, useEffect, useRef } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import "./TEditor.css";

const customStyles = {
  REDCOLOR: {
    color: "red",
  },
};

function TEditor() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const editorRef = useRef(null);


  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      try {
        const content = convertFromRaw(JSON.parse(savedContent));
        setEditorState(EditorState.createWithContent(content));
      } catch (error) {
        console.error("Failed to load content:", error);
      }
    }
  }, []);

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const saveEditorContent = () => {
    const content = editorState.getCurrentContent();
    localStorage.setItem("editorContent", JSON.stringify(convertToRaw(content)));
    alert("Content saved!");
  };

  const handleKeyCommand = (command, currentEditorState) => {
    const newState = RichUtils.handleKeyCommand(currentEditorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const stylePatterns = [
    { regex: /^#$/, style: "header-one" },
    { regex: /^\*$/, style: "BOLD" },
    { regex: /^\*\*$/, style: "REDCOLOR" },
    { regex: /^\*\*\*$/, style: "UNDERLINE" },
  ];

  const handleBeforeInput = (input, currentEditorState) => {
    if (input !== " ") {
      return "not-handled";
    }

    const selection = currentEditorState.getSelection();
    const block = currentEditorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const blockText = block.getText();
    const cursorPosition = selection.getStartOffset();
    const textUntilCursor = blockText.substring(0, cursorPosition);

    for (let pattern of stylePatterns) {
      const match = textUntilCursor.match(pattern.regex);
      if (match) {
        const matchedText = match[0];
        const style = pattern.style;
        applyStyle(currentEditorState, selection, matchedText.length, style);
        return "handled";
      }
    }

    return "not-handled";
  };

  const applyStyle = (currentEditorState, selection, triggerLength, style) => {
    const contentState = currentEditorState.getCurrentContent();
    const start = selection.getStartOffset() - triggerLength;
    const end = selection.getStartOffset();
    const safeStart = start < 0 ? 0 : start;

    const newSelection = selection.merge({
      anchorKey: selection.getStartKey(),
      anchorOffset: safeStart,
      focusKey: selection.getStartKey(),
      focusOffset: end,
    });

    let newContentState = Modifier.removeRange(contentState, newSelection, "backward");
    let newEditorState = EditorState.push(currentEditorState, newContentState, "remove-range");

    if (style.startsWith("header-")) {
      newEditorState = RichUtils.toggleBlockType(newEditorState, style);
    } else {
      if (style === "REDCOLOR") {
        const currentStyle = currentEditorState.getCurrentInlineStyle();
        if (currentStyle.has("UNDERLINE")) {
          newEditorState = RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE");
        }
      }

      const currentInlineStyles = currentEditorState.getCurrentInlineStyle();
      if (currentInlineStyles.has(style)) {
        newEditorState = RichUtils.toggleInlineStyle(newEditorState, style);
      }

      newEditorState = RichUtils.toggleInlineStyle(newEditorState, style);
    }

    setEditorState(newEditorState);
  };

  const blockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    switch (type) {
      case "header-one":
        return "heading";
      case "header-two":
        return "subheading";
      default:
        return "";
    }
  };

  return (
    <div className="text-editor-container">
      <button className="save-button" onClick={saveEditorContent}>
        Save Content
      </button>
      <div className="editor-wrapper" onClick={focusEditor}>
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={customStyles}
          blockStyleFn={blockStyleFn}
          placeholder="Start typing..."
        />
      </div>
    </div>
  );
}

export default TEditor;
