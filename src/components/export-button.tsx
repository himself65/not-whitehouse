import React, { MouseEventHandler, useContext, useState } from "react";

import ImageIcon from "../icons/image-16";
import LinkIcon from "../icons/link-16";
import ChevronDownIcon from "../icons/chevron-down-16";
import ClipboardIcon from "../icons/clipboard-16";

import { FrameContext } from "@/store/FrameContextStore";
import { derivedFlashMessageAtom, flashShownAtom } from "@/store/flash";

import { toPng, toSvg, toBlob } from "@/lib/image";

import useHotkeys from "@/hooks/useHotkeys";
import usePngClipboardSupported from "@/hooks/usePngClipboardSupported";
import { useAtom } from "jotai";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DownloadIcon } from "@raycast/icons";
import { Kbd, Kbds } from "@/components/kbd";

const download = (dataURL: string, filename: string) => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataURL;
  link.click();
};

const customFileName = "output";

const ExportButton: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pngClipboardSupported = usePngClipboardSupported();
  const frameContext = useContext(FrameContext);
  const [, setFlashMessage] = useAtom(derivedFlashMessageAtom);
  const [, setFlashShown] = useAtom(flashShownAtom);
  const fileName = customFileName.replaceAll(" ", "-");

  const savePng = async () => {
    if (!frameContext?.current) {
      throw new Error("Couldn't find a frame to export");
    }

    setFlashMessage({ icon: <ImageIcon />, message: "Exporting PNG" });

    const dataUrl = await toPng(frameContext.current, {
      pixelRatio: 2,
    });

    download(dataUrl, `${fileName}.png`);

    setFlashShown(false);
  };

  const copyPng = async () => {
    setFlashMessage({ icon: <ClipboardIcon />, message: "Copying PNG" });
    if (!frameContext?.current) {
      throw new Error("Couldn't find a frame to export");
    }

    const clipboardItem = new ClipboardItem({
      "image/png": toBlob(frameContext.current, {
        pixelRatio: 2,
      }).then((blob) => {
        if (!blob) {
          throw new Error("expected toBlob to return a blob");
        }
        return blob;
      }),
    });

    await navigator.clipboard.write([clipboardItem]);

    setFlashMessage({
      icon: <ClipboardIcon />,
      message: "PNG Copied to clipboard!",
      timeout: 2000,
    });
  };

  const saveSvg = async () => {
    if (!frameContext?.current) {
      throw new Error("Couldn't find a frame to export");
    }

    setFlashMessage({ icon: <ImageIcon />, message: "Exporting SVG" });

    const dataUrl = await toSvg(frameContext.current);
    download(dataUrl, `${fileName}.svg`);

    setFlashShown(false);
  };

  const dropdownHandler: (handler: () => void) => (event: Event) => void = (
    handler,
  ) => {
    return (event) => {
      event.preventDefault();
      handler();
      setDropdownOpen(false);
    };
  };

  const handleExportClick: MouseEventHandler = (event) => {
    event.preventDefault();

    savePng();
  };

  const copyUrl = async () => {
    setFlashMessage({ icon: <ClipboardIcon />, message: "Copying URL" });

    const url = window.location.toString();
    let urlToCopy = url;

    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(
      `/api/shorten-url?url=${encodedUrl}&ref=codeImage`,
    ).then((res) => res.json());

    if (response.link) {
      urlToCopy = response.link;
    }

    navigator.clipboard.writeText(urlToCopy);

    setFlashMessage({
      icon: <ClipboardIcon />,
      message: "URL Copied to clipboard!",
      timeout: 2000,
    });
  };

  useHotkeys("ctrl+k,cmd+k", (event) => {
    event.preventDefault();
    setDropdownOpen((open) => !open);
  });

  useHotkeys("ctrl+s,cmd+s", (event) => {
    event.preventDefault();
    savePng();
  });
  useHotkeys("ctrl+c,cmd+c", (event) => {
    if (pngClipboardSupported) {
      event.preventDefault();
      copyPng();
    }
  });
  useHotkeys("ctrl+shift+c,cmd+shift+c", (event) => {
    event.preventDefault();
    copyUrl();
  });
  useHotkeys("ctrl+shift+s,cmd+shift+s", (event) => {
    event.preventDefault();
    saveSvg();
  });

  return (
    <ButtonGroup>
      <Button onClick={handleExportClick} aria-label="Export as PNG">
        <DownloadIcon className="w-4 h-4" />
        Export <span className="hidden md:inline-block">Image</span>
      </Button>
      <DropdownMenu
        open={dropdownOpen}
        onOpenChange={(open) => setDropdownOpen(open)}
      >
        <DropdownMenuTrigger asChild>
          <Button aria-label="See other export options">
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem onSelect={dropdownHandler(savePng)}>
            <ImageIcon /> Save PNG{" "}
            <Kbds>
              <Kbd>⌘</Kbd>
              <Kbd>S</Kbd>
            </Kbds>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={dropdownHandler(saveSvg)}>
            <ImageIcon /> Save SVG
            <Kbds>
              <Kbd>⌘</Kbd>
              <Kbd>⇧</Kbd>
              <Kbd>S</Kbd>
            </Kbds>
          </DropdownMenuItem>
          {pngClipboardSupported && (
            <DropdownMenuItem onSelect={dropdownHandler(copyPng)}>
              <ClipboardIcon /> Copy Image
              <Kbds>
                <Kbd>⌘</Kbd>
                <Kbd>C</Kbd>
              </Kbds>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={dropdownHandler(copyUrl)}>
            <LinkIcon /> Copy URL
            <Kbds>
              <Kbd>⌘</Kbd>
              <Kbd>⇧</Kbd>
              <Kbd>C</Kbd>
            </Kbds>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
};

export default ExportButton;
