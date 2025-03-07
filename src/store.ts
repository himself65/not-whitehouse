"use client";
import { atomWithHash } from "jotai-location";

export const windowWidthAtom = atomWithHash<number | null>("width", null);
