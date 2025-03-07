import "prosekit/basic/style.css";

import { createEditor, jsonFromNode, type NodeJSON } from "prosekit/core";
import type { ProseMirrorNode } from "prosekit/pm/model";
import { ProseKit, useDocChange } from "prosekit/react";
import { useCallback, useMemo } from "react";
import { defineBasicExtension } from "prosekit/basic";

export default function Editor({
  defaultContent,
  onDocUpdate,
}: {
  defaultContent?: NodeJSON;
  onDocUpdate?: (doc: NodeJSON) => void;
}) {
  const editor = useMemo(() => {
    const extension = defineBasicExtension();
    return createEditor({ extension, defaultContent });
  }, [defaultContent]);

  const handleDocChange = useCallback(
    (doc: ProseMirrorNode) => onDocUpdate?.(jsonFromNode(doc)),
    [onDocUpdate],
  );
  useDocChange(handleDocChange, { editor });

  return (
    <ProseKit editor={editor}>
      <div className="box-border h-full w-full min-h-36 overflow-y-hidden overflow-x-hidden rounded-md flex flex-col bg-white">
        <div className="relative w-full flex-1 box-border overflow-y-scroll">
          <div
            ref={editor.mount}
            className='font-instrument-serif ProseMirror box-border min-h-full px-[max(4rem,_calc(50%-20rem))] py-8 outline-none outline-0 [&_span[data-mention="user"]]:text-blue-500 [&_span[data-mention="tag"]]:text-violet-500'
          />
        </div>
      </div>
    </ProseKit>
  );
}
