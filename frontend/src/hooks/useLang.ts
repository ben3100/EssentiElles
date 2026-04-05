import { useAuthStore } from '../store/authStore';
import { t, setLanguage } from '../constants/strings';

export function useLang() {
  const language = useAuthStore(s => s.language);
  setLanguage(language as 'fr' | 'en');
  return { t, lang: language };
}
