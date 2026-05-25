import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ProgressBar({ progress, size = 80, strokeWidth = 5 }) {
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (circleRef.current) {
      const offset = ((100 - progress) / 100) * circumference;
      gsap.to(circleRef.current, { strokeDashoffset: offset, duration: 0.8, ease: "power2.out" });
    }
    if (textRef.current) {
      gsap.fromTo(textRef.current, { textContent: 0 }, { textContent: Math.round(progress), duration: 0.8, ease: "power2.out", snap: { textContent: 1 } });
    }
  }, [progress]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-gray-200 text-secondary" />
        <circle ref={circleRef} cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference} className="text-violet-500" />
      </svg>
      <span ref={textRef} className="absolute text-xs font-bold text-primary">0</span>
    </div>
  );
}
