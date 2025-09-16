"use client";

import { decodeJwt } from "jose";

import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import * as React from "react";

import templates from "@/templates/templates";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import { useReactToPrint } from "react-to-print";

// --- Tiptap Core Extensions ---
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Placeholder, Selection } from "@tiptap/extensions";
import { StarterKit } from "@tiptap/starter-kit";

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { ColorHighlightPopoverContent } from "@/components/tiptap-ui/color-highlight-popover";
import { LinkContent } from "@/components/tiptap-ui/link-popover";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";

// --- Hooks ---
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWindowSize } from "@/hooks/use-window-size";

// --- Components ---
import Printable from "@/components/Printable";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

import Actions from "@/components/Actions";
import SnackbarAlert from "@/components/SnackbarAlert";
import { HeadingButton } from "@/components/tiptap-ui/heading-button";
import TiptapToolbar from "@/components/Toolbar";

// const MainToolbarContent = ({
//   isMobile,
//   onPrintClick,
//   confirmSave,
//   patient,
//   content,
// }: {
//   onHighlighterClick: () => void;
//   onLinkClick: () => void;
//   isMobile: boolean;
//   onPrintClick: () => void;
//   confirmSave: (state: boolean) => any;
//   content: string | undefined;
//   patient: any;
// }) => {
//   async function handleSave() {
//     const { patient_id, dicom_uid } = patient;
//     const res = await fetch("http://172.16.0.29/api/notes", {
//       method: "POST",
//       body: JSON.stringify({ id: patient_id, uid: dicom_uid, note: content }),
//       headers: { "Content-Type": "application/json" },
//     });
//     if (res.status === 201) {
//       confirmSave(true);
//       return true;
//     }
//     return false;
//   }
//   return (
//     <>
//       <Spacer />
//       <ToolbarGroup>
//         <Button onClick={handleSave} data-stye="ghost">
//           <img src="save.png" style={{ height: "24px", width: "auto" }}></img>
//         </Button>
//       </ToolbarGroup>
//
//       <ToolbarSeparator />
//
//       <ToolbarSeparator />
//
//       <ToolbarGroup>
//         <MarkButton type="bold" />
//         <MarkButton type="italic" />
//         <MarkButton type="underline" />
//       </ToolbarGroup>
//
//       <ToolbarSeparator />
//
//       <ToolbarGroup>
//         <HeadingButton level={1} />
//         <HeadingButton level={2} />
//         <HeadingButton level={3} />
//
//         <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} portal={isMobile} />
//       </ToolbarGroup>
//
//       <ToolbarSeparator />
//
//       <ToolbarGroup>
//         <TextAlignButton align="left" />
//         <TextAlignButton align="center" />
//         <TextAlignButton align="right" />
//       </ToolbarGroup>
//
//       <ToolbarSeparator />
//
//       <ToolbarGroup>
//         <Button
//           onClick={() => {
//             handleSave();
//             onPrintClick();
//           }}
//           data-stye="ghost"
//         >
//           <img src="print.png" style={{ height: "24px", width: "auto" }}></img>
//         </Button>
//       </ToolbarGroup>
//       <Spacer />
//
//       {isMobile && <ToolbarSeparator />}
//     </>
//   );
// };

// const MobileToolbarContent = ({ type, onBack }: { type: "highlighter" | "link"; onBack: () => void }) => (
//   <>
//     <ToolbarGroup>
//       <Button data-style="ghost" onClick={onBack}>
//         <ArrowLeftIcon className="tiptap-button-icon" />
//         {type === "highlighter" ? (
//           <HighlighterIcon className="tiptap-button-icon" />
//         ) : (
//           <LinkIcon className="tiptap-button-icon" />
//         )}
//       </Button>
//     </ToolbarGroup>
//
//     <ToolbarSeparator />
//
//     {type === "highlighter" ? <ColorHighlightPopoverContent /> : <LinkContent />}
//   </>
// );

export function SimpleEditor({ patient }: any) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  // const [templateValue, setTemplateValue] = React.useState<string>("");

  const isMobile = useIsMobile();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = React.useState<"main" | "highlighter" | "link">("main");
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!patient) return;

    const getReport = async () => {
      const res = await fetch("http://172.16.0.29/api/notes/" + patient.dicom_uid);
      const data = await res.json();

      if (data.note) editor?.commands.setContent(data.note);
    };

    getReport();
  }, [patient]);

  // React.useEffect(() => {
  //   if (Boolean(templateValue)) editor?.commands.setContent(templates[templateValue]);
  //   else editor?.commands.setContent("");
  // }, [templateValue]);

  const [snackbarOpen, setAlert] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token != null && patient != null) {
      const user = decodeJwt(token);
      const isRadiologist = user.id === patient.radiologist;
      editor?.setEditable(isRadiologist);
    }
  }, [patient]);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: { autocomplete: "off", autocorrect: "off", autocapitalize: "off", class: "simple-editor" },
    },
    extensions: [
      Placeholder.configure({ placeholder: "Start typing report" }),
      StarterKit.configure({ horizontalRule: false, link: { openOnClick: false, enableClickSelection: true } }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
  });

  const rect = useCursorVisibility({ editor, overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0 });

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") setMobileView("main");
  }, [isMobile, mobileView]);

  return (
    <div className="">
      <EditorContext.Provider value={{ editor }}>
        <Actions editor={editor} setAlert={setAlert} printFn={reactToPrintFn} />
        <Toolbar ref={toolbarRef} style={{ ...(isMobile ? { bottom: `calc(100% - ${height - rect.y}px)` } : {}) }}>
          <TiptapToolbar />
        </Toolbar>

        <div style={{ display: "none" }}>
          <Printable content={editor?.getHTML()} ref={contentRef} patient={patient} />
        </div>

        <EditorContent editor={editor} role="presentation" className="simple-editor-content" />

        <SnackbarAlert open={snackbarOpen} setAlert={setAlert} />
      </EditorContext.Provider>
    </div>
  );
}
