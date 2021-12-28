import { OutputData } from "@editorjs/editorjs";
import { MutableRefObject, useEffect, useRef, useState } from "react";

import { RichTextEditorChange } from "../../components/RichTextEditor";

function useRichText(opts: {
    initial: string | null;
    triggerChange: () => void;
}): [MutableRefObject<OutputData | undefined>, RichTextEditorChange] {
    const data = useRef<OutputData>();
    const [, setLoaded] = useState(false);

    useEffect(() => {
        if (opts.initial === null) {
            data.current = { blocks: [] };
            setLoaded(true);
            return;
        }

        try {
            data.current = JSON.parse(opts.initial);
            setLoaded(true);
        } catch {
            data.current = undefined;
        }
    }, [opts.initial]);

    const change: RichTextEditorChange = (newData) => {
        opts.triggerChange();
        data.current = newData;
    };

    return [data, change];
}

export default useRichText;
