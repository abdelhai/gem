import { schema } from "./schema";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Node } from "prosemirror-model";
import { undo, redo, history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap, Keymap } from "prosemirror-commands";
import { markdownInputRules, markdownKeyBindings } from "./markdown";
import { CursorPlugin } from "./cursor";
import { initalContent, emptyContent } from "./initial";
import { Storage } from "./storage";

export const main = document.querySelector("main")!;

const storage = new Storage();

export const appState: { editor: EditorState<typeof schema>; buffer: number } =
  {
    editor: EditorState.create<typeof schema>({
      doc: getDoc(),
      schema,
      plugins: [
        history(),
        keymap<typeof schema>({
          "Mod-z": undo,
          "Mod-y": redo,
          ...navigate(),
          ...markdownKeyBindings,
        }),
        keymap<typeof schema>(baseKeymap),
        markdownInputRules,
        CursorPlugin,
      ],
    }),
    buffer: 1,
  };


const view = new EditorView<typeof schema>(main, {
  state: appState.editor,
  dispatchTransaction(transaction) {
    update({ type: "EDITOR_TRANSACTION", payload: transaction });
  },
});
view.focus();

export function update(event: { type: string; payload: any }) {
  if (event.type == "EDITOR_TRANSACTION") {
    appState.editor = appState.editor.apply(event.payload);
    if (event.payload.steps.length > 0) {
      storage.set(appState.buffer.toString(), appState.editor.doc.toJSON());
    }
  }

  if (event.type == "SWITCH_BUFFER") {
    appState.buffer = event.payload as number;
    appState.editor = appState.editor.apply(
      appState.editor.tr.replaceWith(
        0,
        appState.editor.doc.content.size,
        getDoc(appState.buffer)
      )
    );
    document.querySelector(".buffer")!.textContent = `*${appState.buffer}`;
  }

  view.updateState(appState.editor);
}

function getDoc(buffer = 1): Node<typeof schema> {

  const value = storage.get(buffer.toString());

  if (!value && buffer > 1) {
    return Node.fromJSON(schema, emptyContent);
  } else if (!value) {
    return Node.fromJSON(schema, initalContent);
  } else {
    return Node.fromJSON(schema, value);
  }

  
}

function navigate(): Keymap<typeof schema> {
  const keymap: Keymap<typeof schema> = {};
  for (let i = 0; i < 10; i++) {
    keymap[`Ctrl-${i}`] = ctrl(i);
  }
  return keymap;
}

function ctrl(index: number): () => boolean {
  return function (): boolean {
    update({ type: "SWITCH_BUFFER", payload: index });
    return true;
  };
}
