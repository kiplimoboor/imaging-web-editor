import { Spacer } from "./tiptap-ui-primitive/spacer";
import { ToolbarGroup, ToolbarSeparator } from "./tiptap-ui-primitive/toolbar";
import { HeadingButton } from "./tiptap-ui/heading-button";
import { ListDropdownMenu } from "./tiptap-ui/list-dropdown-menu";
import { MarkButton } from "./tiptap-ui/mark-button";
import { TextAlignButton } from "./tiptap-ui/text-align-button";

function TiptapToolbar() {
  return (
    <>
      <Spacer />
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
        <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
      </ToolbarGroup>
      <Spacer />
    </>
  );
}

export default TiptapToolbar;
