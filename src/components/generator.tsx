"use client";
import { createContextState } from "foxact/create-context-state";
import { ReactNode } from "react";
import ResizableFrame from "@/components/resiable-frame";
import ExportButton from "@/components/export-button";
import FrameContextStore from "@/store/FrameContextStore";
import { NoSSR } from "@/components/nossr";

const [Provider, useState, useSetState] = createContextState({
  value: "ARTICLES",
});

type GeneratorProps = {
  children: ReactNode;
};

export const Generator = (props: GeneratorProps) => {
  return (
    <div className="flex flex-col w-full items-center justify-center my-5">
      <FrameContextStore>
        <div className="flex justify-end w-full">
          <ExportButton />
        </div>
        <NoSSR>
          <ResizableFrame>{props.children}</ResizableFrame>
        </NoSSR>
      </FrameContextStore>
    </div>
  );
};

export { Provider, useState, useSetState };
