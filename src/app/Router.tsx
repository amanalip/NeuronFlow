import { useEffect, useState } from 'react';

export interface RouteParams {
  categorySlug?: string;
  conceptSlug?: string;
}

export function parseHash(hash: string): RouteParams {
  const cleanHash = hash.replace(/^#\/?/, '');
  if (!cleanHash) return {};
  const parts = cleanHash.split('/');
  return {
    categorySlug: parts[0] || undefined,
    conceptSlug: parts[1] || undefined,
  };
}

export function useRouter() {
  const [route, setRoute] = useState<RouteParams>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash(window.location.hash));
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (categorySlug: string, conceptSlug: string) => {
    window.location.hash = `/${categorySlug}/${conceptSlug}`;
  };

  return { route, navigate };
}
