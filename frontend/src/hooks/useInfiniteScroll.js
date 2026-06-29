import { useRef, useState, useCallback } from 'react';

export function useInfiniteScroll(fetchCallback, hasMore) {
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setIsFetching(true);
          fetchCallback().finally(() => setIsFetching(false));
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetching, hasMore, fetchCallback]
  );

  return { lastElementRef, isFetching, setIsFetching };
}
