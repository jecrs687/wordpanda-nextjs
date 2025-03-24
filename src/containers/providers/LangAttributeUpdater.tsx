"use client";
import { useI18n } from "@providers/TranslationProvider";
import { useEffect } from "react";

// This component updates the HTML lang attribute based on the current language
export default function LangAttributeUpdater() {
  const { language } = useI18n();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  return null; // This is a utility component, it doesn't render anything
}
