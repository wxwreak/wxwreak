'use client';

export default function Footer() {
  return (
    <footer className="mt-40 pb-20 border-t border-gray-900 pt-10 overflow-hidden">
      <div className="flex flex-col items-center justify-center gap-8">        
        <div className="w-full overflow-hidden select-none pointer-events-none opacity-35 px-4 flex justify-center flex-shrink-0">
          <pre className="font-mono text-[10px] sm:text-[14px] md:text-[20px] leading-none text-white animate-pulse tracking-[0.2em] sm:tracking-[0.4em] text-center">
            <code>
            {` .     +      .          * .     +      .
            * .     +    .          * .     +
          .     +      .          * .     +      .
            * .     +    .          * .     +`}
            </code>
          </pre>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-gray-500 font-mono text-xs uppercase tracking-widest">
          <a href="https://github.com/wxwreak" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Github</a>
          <a href="https://tryhackme.com/p/wxwreak" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TryHackMe</a>
          <a href="https://x.com/wxwreak" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X (Twitter)</a>
          <a href="https://dev.to/wxwreak" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Dev.To</a>
        </div>
      </div>
    </footer>
  );
}
