"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function ThemeLogo() {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const asset = mounted && resolvedTheme === "dark"
    ? "/formora-dark.svg"
    : "/formora-light.svg";

  return <Image src={asset} alt="" width={32} height={32} className="size-8 object-contain" />;
}
