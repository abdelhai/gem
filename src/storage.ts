import { Node } from "prosemirror-model";
import { Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "./schema";
import { app } from "./index";
import { empty, welcome } from "./initial";


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
        let doc = Node.fromJSON(schema, welcome)
        if (data.doc) {
          doc = Node.fromJSON(schema, data.doc);
        } else {
          if (key !== 1) {
            doc = Node.fromJSON(schema, empty);
          }
        }
        app.saved = doc;
        tr.replaceWith(0, tr.doc.content.size, doc);
        view.dispatch(tr);
      });

    }
  });
}

export const SaveStatePlugin = new Plugin({
  view: (view) => {
    load(view, app.key);
    return {
      update: (view) => {
        if (app.saved.eq(view.state.doc)) return;
        save(view, app.key,  Date.now())
      }
    }
  },
});
