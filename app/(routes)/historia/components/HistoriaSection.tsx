// components/sections/historia/HistoriaSection.tsx
"use client";

import HistoriaIntro from "./HistoriaIntro";
import HistoriaTimeline from "./HistoriaTimeline";

const HistoriaSection = () => {
  return (
    <section
      className="bg-[#FBE6D4] animate-in slide-in-from-bottom-8 duration-800"
    >
      <HistoriaIntro />
      <HistoriaTimeline />
    </section>
  );
};

export default HistoriaSection;
