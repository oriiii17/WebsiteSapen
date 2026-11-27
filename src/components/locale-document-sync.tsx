"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function LocaleDocumentSync() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = pathname.split("/")[1];
    if (locale === "id" || locale === "en") {
      document.documentElement.lang = locale;
    }
  }, [pathname]);

  return null;
}
