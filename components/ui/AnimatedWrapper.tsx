"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
};

const AnimatedSection = ({
  children,
  className = "",
  direction = "up",
}: AnimatedSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const animationClass = {
    up: isVisible ? "animate-in slide-in-from-bottom-8 duration-800" : "opacity-0 translate-y-8",
    left: isVisible ? "animate-in slide-in-from-left-8 duration-800" : "opacity-0 -translate-x-8",
    right: isVisible ? "animate-in slide-in-from-right-8 duration-800" : "opacity-0 translate-x-8",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-800 ease-out ${animationClass[direction]} ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
