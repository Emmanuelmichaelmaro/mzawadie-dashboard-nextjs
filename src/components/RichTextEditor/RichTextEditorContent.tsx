// @ts-nocheck
import EditorJS, { LogLevels, OutputData, ToolConstructable, ToolSettings } from "@editorjs/editorjs";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import classNames from "classnames";
import createGenericInlineTool from "editorjs-inline-tool";
import React from "react";

import strikethroughIcon from "../../icons/StrikethroughIcon";
import useStyles from "./styles";

// const EditorJS = dynamic(() => import("@editorjs/editorjs"), { ssr: false });

// const LogLevels = dynamic(
//     async () => {
//         const moduleW = await import("@editorjs/editorjs");
//         return moduleW.LogLevels;
//     },
//     { ssr: false }
// );

// const OutputData = dynamic(
//     async () => {
//         const moduleX = await import("@editorjs/editorjs");
//         return moduleX.OutputData;
//     },
//     { ssr: false }
// );

// const ToolConstructable = dynamic(
//     async () => {
//         const moduleY = await import("@editorjs/editorjs");
//         return moduleY.ToolConstructable;
//     },
//     { ssr: false }
// );

// const ToolSettings = dynamic(
//     async () => {
//         const moduleZ = await import("@editorjs/editorjs");
//         return moduleZ.ToolSettings;
//     },
//     { ssr: false }
// );

// const Embed = dynamic(
//     async () => {
//         const moduleEm = await import("@editorjs/embed");
//         return moduleEm.default;
//     },
//     { ssr: false }
// );

// const Header = dynamic(
//     async () => {
//         const moduleH = await import("@editorjs/header");
//         return moduleH.default;
//     },
//     { ssr: false }
// );

// const List = dynamic(
//     async () => {
//         const moduleL = await import("@editorjs/list");
//         return moduleL.default;
//     },
//     { ssr: false }
// );

// const Paragraph = dynamic(
//     async () => {
//         const moduleP = await import("@editorjs/paragraph");
//         return moduleP.default;
//     },
//     { ssr: false }
// );

// const Quote = dynamic(
//     async () => {
//         const moduleQ = await import("@editorjs/quote");
//         return moduleQ.default;
//     },
//     { ssr: false }
// );

export interface RichTextEditorContentProps {
    className?: string;
    data: OutputData;
    onReady?: () => void;
}

const inlineToolbar = ["link", "bold", "italic", "strikethrough"];

export const tools: Record<string, ToolConstructable | ToolSettings> = {
    embed: Embed,
    header: {
        class: Header,
        config: {
            defaultLevel: 1,
            levels: [1, 2, 3],
        },
        inlineToolbar,
    },
    list: {
        class: List,
        inlineToolbar,
    },
    quote: {
        class: Quote,
        inlineToolbar,
    },
    paragraph: {
        class: Paragraph,
        inlineToolbar,
    },
    strikethrough: createGenericInlineTool({
        sanitize: {
            s: {},
        },
        shortcut: "CMD+S",
        tagName: "s",
        toolboxIcon: strikethroughIcon,
    }),
};

const RichTextEditorContent: React.FC<RichTextEditorContentProps> = ({ className, data, onReady }) => {
    const classes = useStyles({});

    const editor = React.useRef<EditorJS>();
    const editorContainer = React.useRef<HTMLDivElement>();

    React.useEffect(
        () => {
            if (data) {
                editor.current = new EditorJS({
                    data,
                    holder: editorContainer.current,
                    logLevel: "ERROR" as LogLevels,
                    onReady,
                    readOnly: true,
                    tools,
                });
            }

            // eslint-disable-next-line @typescript-eslint/unbound-method
            return editor.current?.destroy;
        },
        // Rerender editor only if changed from undefined to defined state
        [data, onReady]
    );

    return <div className={classNames(classes.editor, className)} ref={editorContainer} />;
};

RichTextEditorContent.displayName = "RichTextEditorContent";

export default RichTextEditorContent;
