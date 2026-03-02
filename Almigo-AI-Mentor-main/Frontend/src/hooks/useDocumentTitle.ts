import { useEffect } from "react";

/**
 * Sets document.title on mount, resets on unmount.
 * Improves SEO by giving each page a unique, descriptive title.
 */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const prev = document.title;
    document.title = `${title} | Almigo`;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
