import { strings } from '../i18n/strings';
import { useMobileStore } from '../store/useMobileStore';

export function useLanguage() {
  const language = useMobileStore((s) => s.language);
  const t = (key) => strings[language]?.[key] ?? strings.en[key] ?? key;
  return { t, language };
}
