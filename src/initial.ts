// A file for initial content loading into the document.

export const welcome = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      attrs: { type: "base" },
      content: [
        {
          type: "text",
          text: "Welcome to Jade – a lightweight and minimal editor designed to be aesthetic and fun.",
        },
      ],
    },
    { type: "paragraph", attrs: { type: "base" } },
    {
      type: "paragraph",
      attrs: { type: "base" },
      content: [
        {
          type: "text",
          text: "You have 10 pages to jot down your thoughts, ideas, and notes. You can switch between them with ",
        },
        { type: "text", marks: [{ type: "code" }], text: "`ctrl-1`" },
        { type: "text", text: " through " },
        { type: "text", marks: [{ type: "code" }], text: "`ctrl-0`" },
        { type: "text", text: "(look at your keyboard)." },
      ],
    },
    { type: "paragraph", attrs: { type: "base" } },
    {
      type: "paragraph",
      attrs: { type: "base" },
      content: [
        {
          type: "text",
          text: "The editor supports simple markdown syntax like: ",
        },
        { type: "text", marks: [{ type: "bold" }], text: "*bold*" },
        { type: "text", text: ", " },
        { type: "text", marks: [{ type: "italic" }], text: "_italic_," },
        { type: "text", text: " and " },
        { type: "text", marks: [{ type: "code" }], text: "`code`" },
      ],
    },
    { type: "paragraph", attrs: { type: "base" } },
    {
      type: "paragraph",
      attrs: { type: "base" },
      content: [
        {
          type: "text",
          text: "Jade's source code is on GitHub and contributions are welcome https://github.com/abdelhai/jade",
        },
      ],
    },
    { type: "paragraph", attrs: { type: "base" } },
    { type: "paragraph", attrs: { type: "base" } },
    {
      type: "paragraph",
      attrs: { type: "base" },
      content: [
        {
          type: "text",
          text: "To get started, clear this page and start typing.",
        },
      ],
    },
  ],
};

export const empty = {
  type: "doc",
  content: [{ type: "paragraph", attrs: { type: "base" } }],
};

