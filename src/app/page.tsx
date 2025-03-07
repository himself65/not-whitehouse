import { Template } from "@/components/template";
import { Generator, Provider } from "@/components/generator";
import ogUrl from "./og.png";
import { Metadata } from "next";

const title = "Not whitehouse.gov";
const description = "Not whitehouse.gov";

const BASE_URL = {
  development: "http://localhost:3000",
  preview: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
  production: "https://www.notwhitehousse.com",
}[process.env.NEXT_PUBLIC_VERCEL_ENV || "development"] as string;

export const metadata: Metadata = {
  title,
  openGraph: {
    url: BASE_URL,
    title: title,
    description: description,
    images: [
      {
        url: ogUrl.src,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
};

export default function Home() {
  return (
    <Provider>
      <Generator>
        <Template />
      </Generator>
    </Provider>
  );
}
