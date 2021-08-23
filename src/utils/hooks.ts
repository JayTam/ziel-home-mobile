import { useLayoutEffect, useEffect, useRef, ForwardedRef, useState } from "react";
import { isClient } from "./base";

const useIsomorphicLayoutEffect = isClient() ? useLayoutEffect : useEffect;

export function useLockBodyScroll(open = true) {
  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on mount
    document.body.style.overflow = "hidden";
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [open]); // Empty array ensures effect is only run on mount and unmount
}

export function useCombinedRefs<T>(...refs: ForwardedRef<T>[]) {
  const targetRef = useRef<T>(null);

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        if (targetRef.current) ref(targetRef.current);
      } else {
        if (targetRef.current) ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}

interface useInfiniteScrollProps {
  hasMore: boolean;
  initialPage?: number;
}

export function useInfiniteScroll<T extends HTMLElement>(props: useInfiniteScrollProps) {
  const loaderRef = useRef<T>(null);
  const [page, setPage] = useState<number>(props.initialPage ?? 1);
  const [loading, setLoading] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      // 如果不可见，就结束
      if (entries[0].intersectionRatio <= 0) return;
      // 正在请求中，跳过
      if (loading) return;
      // 更新页码
      setPage((prev) => ++prev);
    });

    if (loaderRef.current) io.observe(loaderRef.current);

    return () => {
      io.disconnect();
    };
  }, [page, loading, props.hasMore, firstLoading]);

  return { page, setPage, loaderRef, loading, setLoading, firstLoading, setFirstLoading };
}
