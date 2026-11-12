"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function ThemeLogo({ className = "size-8" }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const asset = mounted && resolvedTheme === "dark"
    ? "/formora-dark.svg"
    : "/formora-light.svg";

  return <Image src={asset} alt="" width={40} height={40} className={`${className} object-contain`} />;
}
