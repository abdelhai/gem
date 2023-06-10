import { Node } from "prosemirror-model";
import { Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "./schema";
import { app } from "./index";
import { emptyContent } from "./initial";


export const save = (view: EditorView<typeof schema>, key: number, time: number) => {
  if (app.current > 0 && time - app.current < 500) {
    app.tbs = true;
    return;
  };
  app.current = time;
  const doc = view.state.tr.doc.toJSON();
  fetch(`/api/save`, {
    method: "POST",
    body: JSON.stringify({key, doc}),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export const load = (view: EditorView<typeof schema>, key: number) => {
  fetch(`/api/get/${key}`).then(async (r) => {
    if (r.ok) {
      r.json().then((data) => {
        const tr = view.state.tr;
        if (data.doc) {
          const doc = Node.fromJSON(schema, data.doc);
          tr.replaceWith(0, tr.doc.content.size, doc);
          view.dispatch(tr);
        } else {
          tr.replaceWith(0, tr.doc.content.size, Node.fromJSON(schema, emptyContent));
          view.dispatch(tr);
        }
      });

    }
  });
}

export const SaveStatePlugin = new Plugin({
  view: (view) => {
    load(view, app.key);
    return {
      update: (view) => {
        save(view, app.key,  Date.now())
      }
    }
  },
});
