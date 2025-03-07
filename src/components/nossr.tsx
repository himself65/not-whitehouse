import dynamic from "next/dynamic";
import React, { PropsWithChildren } from "react";

const _NoSSR: React.FC<PropsWithChildren> = ({ children }) => (
  <React.Fragment>{children}</React.Fragment>
);

export const NoSSR = dynamic(() => Promise.resolve(_NoSSR), {
  ssr: false,
});
