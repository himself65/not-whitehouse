"use client";
import { Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSetState, useState } from "@/components/generator";
import { useContext, useRef } from "react";
import Editor from "@/components/editor";
import { FrameContext } from "@/store/FrameContextStore";

export const Template = () => {
  const frameContext = useContext(FrameContext);
  const state = useState();
  const setState = useSetState();
  const tagInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="font-instrument-serif flex flex-col" ref={frameContext}>
      <header className="bg-[#0d132d] text-white border-b-2 border-white font-bold">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <button className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <span>Menu</span>
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className=" hover:underline">
              NEWS
            </a>
            <a href="#" className=" hover:underline">
              ADMINISTRATION
            </a>
            <a href="#" className="hover:underline">
              ISSUES
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <span className="text-sm">Search</span>
            <Search className="h-5 w-5" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-[#0d132d] text-white py-12 text-center">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <div className="flex justify-center">
                <a href="#" className="grid gap-1.5 justify-items-center">
                  <Image
                    src="https://www.whitehouse.gov/wp-content/themes/whitehouse/assets/img/whitehouse-47-logo.png"
                    alt="The White House"
                    width={868}
                    height={404}
                    className="w-[155px] md:w-[9rem] lg:w-[11rem] h-auto mb-2.5"
                    priority
                  />
                </a>
              </div>
            </div>

            <div className="mb-8 flex items-center justify-center">
              <Button
                variant="outline"
                className="relative rounded-full border-white text-white bg-transparent"
                onClick={(event) => {
                  event.preventDefault();
                  tagInputRef.current?.focus();
                }}
              >
                <span className="font-bold">{state.value}</span>
                <input
                  className="absolute size-full opacity-0"
                  defaultValue={state.value}
                  onChange={(e) => setState({ value: e.target.value })}
                  ref={tagInputRef}
                />
              </Button>
            </div>

            <Textarea
              className="text-4xl text-center md:text-6xl lg:text-7xl font-serif tracking-tight leading-tight max-w-4xl mx-auto resize-none border-0"
              defaultValue={`MAKE UNITED STATES GREAT AGAIN`}
            />

            <div className="mt-12">
              <p className="mt-2">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </section>

        <section className="py-4 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <Editor />
          </div>
        </section>
      </main>
    </div>
  );
};
