import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from './locales/en.json';
import es from './locales/es.json';
import ca from './locales/ca.json';

const dictionaries = { en, es, ca };

const I18nContext = createContext({
  locale: 'en',
  setLocale: () => {},
  t: (key, fallback) => fallback ?? key,
});

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(() => localStorage.getItem('locale') || 'en');

  useEffect(() => {
    localStorage.setItem('locale', locale);
    const html = document.documentElement;
    html.lang = locale;
  }, [locale]);

  const t = useMemo(() => {
    const dict = dictionaries[locale] || dictionaries.en;
    return (key, fallback) => {
      const parts = String(key).split('.');
      let cur = dict;
      for (const p of parts) {
        cur = cur?.[p];
        if (cur === undefined) break;
      }
      if (typeof cur === 'string') return cur;
      return fallback ?? key;
    };
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return React.createElement(I18nContext.Provider, { value }, children);
}

export function useI18n() {
  return useContext(I18nContext);
}
