import { ForwardedRef, useEffect, useRef } from "react";

/**
 * 组件中的一个 ref 上绑定多个 refs
 * @param refs
 */
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
