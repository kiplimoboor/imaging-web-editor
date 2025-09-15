"use client";

import { decodeJwt } from "jose";

import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import * as React from "react";

import templates from "@/templates/templates";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import { useReactToPrint } from "react-to-print";

import Alert from "@mui/material/Alert";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";

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

import { HeadingButton } from "@/components/tiptap-ui/heading-button";

const MainToolbarContent = ({
  isMobile,
  onPrintClick,
  confirmSave,
  patient,
  content,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
  onPrintClick: () => void;
  confirmSave: (state: boolean) => any;
  content: string | undefined;
  patient: any;
}) => {
  async function handleSave() {
    const { patient_id, dicom_uid } = patient;
    const res = await fetch("http://172.16.0.29/api/notes", {
      method: "POST",
      body: JSON.stringify({ id: patient_id, uid: dicom_uid, note: content }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 201) {
      confirmSave(true);
      return true;
    }
    return false;
  }
  return (
    <>
      <Spacer />
      <ToolbarGroup>
        <Button onClick={handleSave} data-stye="ghost">
          <img src="save.png" style={{ height: "24px", width: "auto" }}></img>
        </Button>
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* <ToolbarGroup> */}
      {/*   <UndoRedoButton action="undo" /> */}
      {/*   <UndoRedoButton action="redo" /> */}
      {/* </ToolbarGroup> */}

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="underline" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingButton level={1} />
        <HeadingButton level={2} />
        <HeadingButton level={3} />

        <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} portal={isMobile} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <Button
          onClick={() => {
            handleSave();
            onPrintClick();
          }}
          data-stye="ghost"
        >
          <img src="print.png" style={{ height: "24px", width: "auto" }}></img>
        </Button>
      </ToolbarGroup>
      <Spacer />

      {isMobile && <ToolbarSeparator />}

      {/* <ToolbarGroup> */}
      {/*   <ThemeToggle /> */}
      {/* </ToolbarGroup> */}
    </>
  );
};

const MobileToolbarContent = ({ type, onBack }: { type: "highlighter" | "link"; onBack: () => void }) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? <ColorHighlightPopoverContent /> : <LinkContent />}
  </>
);

export function SimpleEditor({ patient }: any) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [templateValue, setTemplateValue] = React.useState<string>("");
  const [canEdit, setCanEdit] = React.useState<boolean>(false);

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

  React.useEffect(() => {
    if (Boolean(templateValue)) editor?.commands.setContent(templates[templateValue]);
    else editor?.commands.setContent("");
  }, [templateValue]);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const editor = useEditor({
    editable: canEdit,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      Placeholder.configure({ placeholder: "Start typing report" }),
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
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

  React.useEffect(() => {
    const token = localStorage.getItem("token");

    if (token != null && patient != null) {
      const user = decodeJwt(token);
      const isRadiologist = user.id === patient.radiologist;
      setCanEdit(isRadiologist);

      if (editor) {
        editor.setOptions({ editable: isRadiologist });
      }
    }
  }, [patient, editor]);

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "12px",
          }}
        >
          {canEdit && (
            <Autocomplete
              value={templateValue}
              options={Object.keys(templates)}
              onChange={(_, newValue: string | null) => {
                if (newValue !== null) {
                  setTemplateValue(newValue);
                } else {
                  setTemplateValue("");
                }
              }}
              id="controllable-states-demo"
              disablePortal
              sx={{ width: 450 }}
              renderInput={(params) => <TextField {...params} label="Template" />}
            />
          )}
        </div>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
              onPrintClick={reactToPrintFn}
              content={editor?.getHTML()}
              patient={patient}
              confirmSave={setSnackbarOpen}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <div style={{ display: "none" }}>
          <Printable content={editor?.getHTML()} ref={contentRef} patient={patient} />
        </div>

        <EditorContent editor={editor} role="presentation" className="simple-editor-content" />
      </EditorContext.Provider>
      {canEdit && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
            Report Saved Successfully
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}
