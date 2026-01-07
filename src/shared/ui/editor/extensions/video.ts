import { Node, mergeAttributes } from "@tiptap/core";

export interface VideoOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: {
        src: string;
        controls?: boolean;
        className?: string;
      }) => ReturnType;
    };
  }
}

export const Video = Node.create<VideoOptions>({
  name: "video",
  group: "block",

  atom: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class:
          "rounded-md border border-border bg-black/5 my-4 max-h-[500px] w-auto mx-auto",
        controls: "true",
      },
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
      },
      className: {
        default: "rounded-md max-w-full my-4",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "video",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { className, ...rest } = HTMLAttributes;
    return [
      "video",
      mergeAttributes(this.options.HTMLAttributes, { class: className }, rest),
    ];
  },

  addCommands() {
    return {
      setVideo:
        ({ src, controls = true, className = "rounded-md max-w-full my-4" }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { src, controls, className },
          });
        },
    };
  },
});
