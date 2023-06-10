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
import { SaveStatePlugin, load, save } from "./storage";

export const main = document.querySelector("main")!;


export const app: { state: EditorState<typeof schema>; key: number, current: number, tbs: boolean } =
  {
    state: EditorState.create<typeof schema>({
      doc: Node.fromJSON(schema, emptyContent),
      schema,
      plugins: [
        history(),
        keymap<typeof schema>({
          "Mod-z": undo,
          "Mod-y": redo,
          ...switcher(),
          ...markdownKeyBindings,
        }),
        keymap<typeof schema>(baseKeymap),
        markdownInputRules,
        CursorPlugin,
        SaveStatePlugin
      ],
    }),
    key: 1,
    current: 0,
    tbs: false,
  };


const view = new EditorView<typeof schema>(main, {
  state: app.state,
});
view.focus();

// sync every 1s anyway
setInterval(() => {
  if (app.tbs) {
    save(view, app.key, Date.now())
    app.tbs = false;
  }
}, 1000);


function switcher(): Keymap<typeof schema> {
  const keymap: Keymap<typeof schema> = {};
  for (let i = 0; i < 10; i++) {
    keymap[`Ctrl-${i}`] = navigate(i);
  }
  return keymap;
}

function navigate(index: number): any {
  return function (): boolean {
    app.key = index;
    document.querySelector(".buffer")!.textContent = `*${app.key}`
    load(view, app.key);
    return true;
  };
}
