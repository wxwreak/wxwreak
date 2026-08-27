import Image from "next/image";
import Link from 'next/link';
import Footer from '@/components/Footer';
import ProjectRow from '@/components/ProjectRow';
import SkillRow from '@/components/SkillRow';
import AIContext from '@/components/AIContext';

export default function Home() {
  const currentHour = Math.floor(Date.now() / (1000 * 60 * 60));
  const pfpUrl = `https://avatars.githubusercontent.com/u/217353155?v=4&s=160&t=${currentHour}`;
  return (
    <div className="bg-black text-white selection:bg-white selection:text-black min-h-screen font-sans antialiased">
      <AIContext />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 md:pt-32">
        <section className="mb-20 md:mb-40">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 md:gap-10">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-40 md:h-40 shrink-0 overflow-hidden rounded-2xl border-2 border-white sm:translate-y-4">
              <Image 
                src={pfpUrl}
                alt="Profile" 
                className="object-cover" 
                fill 
                priority 
                sizes="(max-width: 768px) 96px, 160px"
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-5xl sm:text-6xl md:text-[140px] font-bold leading-[0.85] md:leading-[0.75] tracking-tighter uppercase italic">
                wxwreak
              </h1>
              <p className="text-gray-500 font-mono text-xs sm:text-sm md:text-base mt-2 sm:mt-4 sm:ml-2 tracking-[0.1em] sm:tracking-[0.2em] uppercase">
                Infrastructure, Automation & Security Tooling
              </p>
              
              {/* Odkaz na blog přidaný hned nahoru */}
              <div className="mt-4 sm:ml-2">
                <Link 
                  href="/blog" 
                  className="font-mono text-xs sm:text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-widest inline-flex items-center gap-2 group"
                >
                  <span>[ Read my blog ]</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

    <div className="mt-24 mb-10 ml-2">
      <h2 className="text-4xl md:text-6xl font-bold uppercase italic tracking-tighter text-gray-200 opacity-50">
        Skills
      </h2>
      <div className="h-[2px] w-12 bg-gray-900 mt-2"></div>
    </div>

        <section className="border-t border-gray-900">
          <SkillRow
            category="Backend & Scripting"
            skills="Python"
            level="[ 2022 - Present ]"
          />
          <SkillRow
            category="Systems & Tooling"
            skills="Go"
            level="[ Active Development ]"
          />
          <SkillRow
            category="Infrastructure"
            skills="Docker, Linux"
            level="[ Hands-on ]"
          />
          <SkillRow
            category="Cyber Security"
            skills="TryHackMe"
            level="[ 2024 - Present ]"
          />
        </section>

    <div className="mt-24 mb-10 ml-2">
      <h2 className="text-4xl md:text-6xl font-bold uppercase italic tracking-tighter text-gray-200 opacity-50">
        Projects
      </h2>
      <div className="h-[2px] w-12 bg-gray-900 mt-2"></div>
    </div>

<section className="space-y-0 border-t border-gray-900">
  <ProjectRow 
    number="01"
    title={
      <div className="flex items-center flex-wrap gap-2">
      <span className="font-bold">updateit</span>
      <span className="text-xs uppercase px-2 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 font-medium">
      I personally use it
      </span>
    </div>
  }
    description="CLI tool to update all packages from listed package managers."
    url="https://github.com/wxwreak/updateit"
  />
  <ProjectRow 
    number="02"
    title={
      <div className="flex items-center flex-wrap gap-2">
      <span className="font-bold">ppush</span>
      <span className="text-xs uppercase px-2 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 font-medium">
      I personally use it
      </span>
    </div>
  }
    description="lightweight Python automation script designed to streamline your Git workflow. Stop typing three commands repeatedly—do it all with one."
    url="https://github.com/wxwreak/ppush"
  />
  <ProjectRow
    number="03"
    title={
      <div className="flex items-center flex-wrap gap-2">
      <span className="font-bold">Vulnfy</span>
      <span className="text-xs uppercase px-2 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 font-medium">
      I personally use it
      </span>
      </div>
    }
    description="Vulnfy is a lightweight, cross-platform dependency and container vulnerability scanner written in Python. It automatically detects project configuration/lock files across multiple languages and ecosystems, queries the OSV API, and generates a structured JSON vulnerability report."
    url="https://github.com/wxwreak/vulnfy"
  />
  <ProjectRow
    number="04"
    title={
      <div className="flex items-center flex-wrap gap-2">
      <span className="font-bold">webrr</span>
      <span className="text-xs uppercase px-2 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 font-medium">
      I personally use it
      </span>
      </div>
    }
    description="Webrr is a command-line utility written in Go designed to perform reconnaissance on web servers. It checks for security-related HTTP headers, detects Web Application Firewalls (WAFs), and identifies Content Management Systems (CMS)."
    url="https://github.com/wxwreak/webrr"
    />
  <ProjectRow
    number="05"
    title={
      <div className="flex items-center flex-wrap gap-2">
      <span className="font-bold">fuzzmap</span>
      <span className="text-xs uppercase px-2 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 font-medium">
      I personally use it
      </span>
      </div>
    }
    description="Fuzzmap is a simple and fast command-line web fuzzing tool written in Go. It allows you to discover hidden directories, files, and endpoints on a target web server using a specified wordlist and concurrent threads."
    url="https://github.com/wxwreak/fuzzmap"
    />
  <ProjectRow
    number="06"
    title={
      <div className="flex items-center flex-wrap gap-2">
      <span className="font-bold">lpechk</span>
      <span className="text-xs uppercase px-2 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 font-medium">
      I personally use it sometimes
      </span>
      </div>
    }
    description="A lightweight, automated local enumeration tool written in Go designed to audit Linux systems for potential privilege escalation vectors, misconfigurations, and sensitive data exposure."
    url="https://github.com/wxwreak/lpechk"
    />
</section>
    <div className="mt-24 mb-10 ml-2">
      <h2 className="text-4xl md:text-6xl font-bold uppercase italic tracking-tighter text-gray-200 opacity-50">
        Experiences
      </h2>
      <div className="h-[2px] w-12 bg-gray-900 mt-2"></div>
    </div>
    <p className="mt-6 text-sm md:text-base font-medium uppercase tracking-widest text-white italic opacity-50">
      [ Coming Soon ]
    </p>
        <Footer />
      </main>
    </div>
  );
}