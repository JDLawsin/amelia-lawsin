"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
};

const subscribe = () => () => {};

/** Renders children on document.body so fixed positioning is viewport-relative. */
export const BodyPortal = ({ children }: Props) => {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!mounted) return null;

  return createPortal(children, document.body);
};
