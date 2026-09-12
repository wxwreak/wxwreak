'use client';

export default function ReposRow({ number, title, subtitle, description, url, tags }) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="group border-b border-gray-900 py-10 flex flex-col justify-between cursor-pointer hover:bg-[#0a0a0a] transition-all px-4 gap-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-baseline gap-4 md:gap-6 flex-wrap">
          <span className="font-mono text-xs text-gray-600">{number}</span>
          
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-2xl md:text-3xl font-semibold text-white/90 group-hover:text-white transition-colors duration-300">
              {title}
            </div>
            {subtitle && (
              <>
                <span className="text-gray-600">·</span>
                <span className="text-gray-400 text-sm md:text-base font-light">
                  {subtitle}
                </span>
              </>
            )}
            <span className="text-gray-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 ml-1">
              ↗
            </span>
          </div>
        </div>
      </div>

      <div className="pl-0 sm:pl-10 flex flex-col gap-4">
        <p className="text-gray-400 text-sm md:text-base font-light tracking-wide max-w-2xl leading-relaxed">
          {description}
        </p>

        {tags && tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap font-mono text-xs text-gray-500">
            {tags.map((tag, index) => (
              <span key={tag} className="flex items-center gap-2">
                <span>{tag}</span>
                {index < tags.length - 1 && <span className="text-gray-700">·</span>}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}