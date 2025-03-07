import React, {
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";
import { useAtom } from "jotai";
import { windowWidthAtom } from "@/store";
import classnames from "classnames";
import { CSSTransition } from "react-transition-group";

import styles from "./resizable-frame.module.css";

const XMarkIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM6.28033 5.21967C5.98744 4.92678 5.51256 4.92678 5.21967 5.21967C4.92678 5.51256 4.92678 5.98744 5.21967 6.28033L6.93934 8L5.21967 9.71967C4.92678 10.0126 4.92678 10.4874 5.21967 10.7803C5.51256 11.0732 5.98744 11.0732 6.28033 10.7803L8 9.06066L9.71967 10.7803C10.0126 11.0732 10.4874 11.0732 10.7803 10.7803C11.0732 10.4874 11.0732 10.0126 10.7803 9.71967L9.06066 8L10.7803 6.28033C11.0732 5.98744 11.0732 5.51256 10.7803 5.21967C10.4874 4.92678 10.0126 4.92678 9.71967 5.21967L8 6.93934L6.28033 5.21967Z"
        fill="currentColor"
      />
    </svg>
  );
};

type Handle = "right" | "left";

const maxWidth = 920;
const minWidth = 520;

const ResizableFrame: React.FC<PropsWithChildren> = ({ children }) => {
  const currentHandleRef = useRef<Handle>(null!);
  const windowRef = useRef<HTMLDivElement>(null);
  const startWidthRef = useRef<number>(0);
  const startXRef = useRef<number>(0);
  const [windowWidth, setWindowWidth] = useAtom(windowWidthAtom);
  const [isResizing, setResizing] = useState(false);
  const resetWindowWidthRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);

  const mouseMoveHandler = useCallback(
    (event: MouseEvent) => {
      let newWidth;

      if (currentHandleRef.current === "left") {
        newWidth =
          startWidthRef.current! - (event.clientX - startXRef.current!) * 2;
      } else {
        newWidth =
          startWidthRef.current! + (event.clientX - startXRef.current!) * 2;
      }

      if (newWidth > maxWidth) {
        newWidth = maxWidth;
      } else if (newWidth < minWidth) {
        newWidth = minWidth;
      }

      setWindowWidth(newWidth);
    },
    [setWindowWidth],
  );

  const clearSelection = useCallback(() => {
    const sel = document.getSelection();
    if (sel) {
      if (sel.removeAllRanges) {
        sel.removeAllRanges();
      } else if (sel.empty) {
        sel.empty();
      }
    }
  }, []);

  const mouseUpHandler = useCallback(() => {
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
    setResizing(false);
    clearSelection();
  }, [mouseMoveHandler, clearSelection]);

  const handleResizeFrameX = useCallback(
    (handle: Handle): MouseEventHandler<HTMLDivElement> =>
      (event) => {
        currentHandleRef.current = handle;
        startWidthRef.current = windowRef.current!.offsetWidth;
        startXRef.current = event.clientX;
        setResizing(true);

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
      },
    [mouseMoveHandler, mouseUpHandler],
  );

  return (
    <div
      className={classnames(
        styles.resizableFrame,
        isResizing && styles.isResizing,
      )}
    >
      <div
        className={classnames(styles.windowSizeDragPoint, styles.left)}
        onMouseDown={handleResizeFrameX("left")}
      ></div>
      <div
        className={classnames(styles.windowSizeDragPoint, styles.right)}
        onMouseDown={handleResizeFrameX("right")}
      ></div>
      <div ref={windowRef} style={{ width: windowWidth || "auto" }}>
        {children}
      </div>

      <CSSTransition
        nodeRef={resetWindowWidthRef}
        in={!!(windowWidth && !isResizing)}
        unmountOnExit
        timeout={200}
        classNames={{
          enter: styles.fadeEnter,
          enterActive: styles.fadeEnterActive,
          exit: styles.fadeExit,
          exitActive: styles.fadeExitActive,
        }}
      >
        <div className={styles.resetWidthContainer} ref={resetWindowWidthRef}>
          <a
            className={styles.resetWidth}
            onClick={(event) => {
              event.preventDefault();
              setWindowWidth(null);
            }}
          >
            <XMarkIcon />
            Set to auto width
          </a>
        </div>
      </CSSTransition>

      <CSSTransition
        nodeRef={rulerRef}
        in={isResizing}
        unmountOnExit
        timeout={200}
        classNames={{
          enter: styles.fadeEnter,
          enterActive: styles.fadeEnterActive,
          exit: styles.fadeExit,
          exitActive: styles.fadeExitActive,
        }}
      >
        <div ref={rulerRef} className={styles.ruler}>
          <span
            style={{
              padding: "0 1em",
              backgroundColor: "#0d0d0d",
            }}
          >
            {windowWidth} px
          </span>
        </div>
      </CSSTransition>
    </div>
  );
};

export default ResizableFrame;
