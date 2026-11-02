"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Snowfall = dynamic(() => import("react-snowfall"), { ssr: false });

export default function SessonalEffects() {
  const [season, setSeason] = useState(null);

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    if ((month === 10 && day >= 25) || (month === 11 && day <= 3)) {
      setSeason("halloween");
    } else if (month === 12 || (month === 1 && day <= 15)) {
      setSeason("winter");
    }
  }, []);

  if (!season) return null;

  if (season === "halloween") {
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none font-mono">
        <div className="absolute inset-0 bg-[#ff6600]/[0.01] animate-flicker" />

        <div className="absolute top-0 right-24 flex flex-col items-center animate-wiggle">
          <div className="w-[3px] h-20 bg-gradient-to-b from-zinc-900 to-zinc-700 border-x border-zinc-800" />

          <div className="relative w-24 h-32 mt-[-2px]">
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-48 bg-orange-600/20 rounded-full blur-[50px] animate-flicker pointer-events-none" />

            <svg
              className="w-full h-full text-zinc-800 drop-shadow-[0_6px_16px_rgba(0,0,0,0.9)]"
              viewBox="0 0 24 34"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <circle cx="12" cy="3" r="2" strokeWidth="1.5" />
              <path d="M4 8 L12 5 L20 8 L18 11 L6 11 Z" fill="#18181b" strokeWidth="1.5" />
              <path d="M6 11 L18 11 L16 28 L8 28 Z" fill="#ff6600" className="fill-orange-600 animate-flicker" opacity="0.85" />
              <path d="M10 18 Q12 13 12 13 Q12 13 14 18 Q12 22 10 18 Z" fill="#facc15" className="fill-yellow-400" />
              <path d="M6 11 L8 28 M18 11 L16 28 M12 11 L12 28 M6 19 L18 19 M7 24 L17 24" strokeWidth="1.2" />
              <path d="M8 28 L16 28 L15 31 L9 31 Z" fill="#18181b" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        <div className="absolute top-56 right-6 text-[9px] sm:text-[11px] text-orange-600/25 leading-tight font-mono tracking-wider text-right">
          <pre className="font-mono inline-block text-left">
{`0x00000000  00 00 00 00 00 00 00 00
0x00000008  ff 41 41 41 41 41 41 41
0x00000010  31 c0 c3 90 55 48 89 e5
[SIGSEGV]   Segmentation fault`}
          </pre>
        </div>
      </div>
    );
  }

  if (season === "winter") {
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
        <Snowfall
          color="#ffffff"
          snowflakeCount={35}
          radius={[0.5, 2.5]}
          speed={[0.4, 1.4]}
          wind={[-0.3, 0.3]}
        />

        <div className="absolute bottom-6 right-8 font-mono text-[11px] sm:text-[13px] md:text-[15px] leading-none text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)] z-40 text-right select-none pointer-events-none">
          <div className="absolute bottom-8 right-4 w-40 h-40 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none" />

          <pre className="font-mono text-center leading-[1.2] tracking-wider animate-pulse" style={{ animationDuration: "4s" }}>
            <code className="text-yellow-400 font-bold drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]">    *    </code>{"\n"}
            <code className="text-emerald-400">   /1\   </code>{"\n"}
            <code className="text-emerald-500">  /010\  </code>{"\n"}
            <code className="text-emerald-500"> /10101\ </code>{"\n"}
            <code className="text-emerald-600"> /011010\</code>{"\n"}
            <code className="text-emerald-600">/1010110\</code>{"\n"}
            <code className="text-amber-800 font-bold">   [X]   </code>
          </pre>

          <div className="text-[9px] text-zinc-600 tracking-[0.3em] uppercase mt-2 text-center">
            ctx.marry_christmas()
          </div>
        </div>
      </div>
    );
  }

  return null;
}
