import { useEffect, useRef } from "react";

/**
 * CSS-based entrance animation hook.
 * Adds `.animate-enter` class to the ref'd element on mount.
 * Replaces GSAP `.from()` patterns that caused conflicts with CSS transitions.
 */
export function useAnimateIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("animate-enter");
  }, []);
  return ref;
}

/**
 * Staggered entrance for children of the ref'd container.
 * Each child gets an increasing `animationDelay` and the `.animate-enter` class.
 * @param {number} delay - seconds between each child's animation start (default 0.05)
 */
export function useStaggerIn(delay = 0.05) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const children = Array.from(el.children);
    children.forEach((child, i) => {
      (child).style.animationDelay = `${i * delay}s`;
      child.classList.add("animate-enter");
    });
  }, []);
  return ref;
}
