import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import * as React from "react";

import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { StarterKit } from "@tiptap/starter-kit";

import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-templates/simple/simple-editor.scss";

import { useStudy } from "@/context/StudyContext";
import { useUser } from "@/context/UserContext";
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWindowSize } from "@/hooks/use-window-size";
import { useReactToPrint } from "react-to-print";

import Actions from "@/components/Actions";
import Printable from "@/components/Printable";
import SnackbarAlert from "@/components/SnackbarAlert";
import TiptapToolbar from "@/components/Toolbar";
import { Toolbar } from "@/components/tiptap-ui-primitive/toolbar";

export function SimpleEditor() {
  const [alert, setAlert] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = React.useState<"main" | "highlighter" | "link">("main");
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({ contentRef });
  const { study } = useStudy();
  const { user } = useUser();

  React.useEffect(() => {
    if (study == null) return;

    const fetchNotes = async () => {
      const res = await fetch("http://172.16.0.29/api/notes/" + study.dicom_uid);
      const data = await res.json();
      const note: string = data.note;
      editor?.commands.setContent(note);
    };
    fetchNotes();

    const canEdit = user?.id === study.radiologist;
    editor?.setEditable(canEdit);
    if (user) user.canEdit = canEdit;
  }, [study]);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: { attributes: { class: "simple-editor" } },
    extensions: [StarterKit.configure({}), TextAlign.configure({ types: ["heading", "paragraph"] }), Typography],
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
          <Printable content={editor?.getHTML()} ref={contentRef} />
        </div>

        <EditorContent editor={editor} role="presentation" className="simple-editor-content" />

        <SnackbarAlert open={alert} setAlert={setAlert} />
      </EditorContext.Provider>
    </div>
  );
}
