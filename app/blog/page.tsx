import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function BlogIndex() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  
  if (!fs.existsSync(postsDirectory)) {
    return (
      <div className="bg-black text-white selection:bg-white selection:text-black min-h-screen font-sans antialiased flex flex-col justify-between">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 md:pt-32 w-full">
          <div className="mb-12">
            <Link 
              href="/" 
              className="font-mono text-xs sm:text-sm text-gray-500 hover:text-white transition uppercase tracking-widest inline-block"
            >
              &larr; [ Back home ]
            </Link>
          </div>
          <div className="flex items-center justify-center py-32">
            <p className="font-mono text-gray-500 uppercase tracking-widest">[ No articles found ]</p>
          </div>
        </main>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
          <Footer />
        </div>
      </div>
    );
  }

  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      slug,
      ...matterResult.data,
    } as { slug: string; title?: string; date?: string; description?: string };
  });

  return (
    <div className="bg-black text-white selection:bg-white selection:text-black min-h-screen font-sans antialiased">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 md:pt-32">
        
        <div className="mb-12">
          <Link 
            href="/" 
            className="font-mono text-xs sm:text-sm text-gray-500 hover:text-white transition uppercase tracking-widest inline-block"
          >
            &larr; [ Back home ]
          </Link>
        </div>

        <section className="mb-20">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[0.85] tracking-tighter uppercase italic">
            Blog
          </h1>
          <p className="text-gray-500 font-mono text-xs sm:text-sm md:text-base mt-4 ml-1 tracking-[0.1em] sm:tracking-[0.2em] uppercase">
            Insights from development, real-world security vulnerabilities & tooling
          </p>
        </section>

        <div className="mt-16 mb-10 ml-2">
          <h2 className="text-4xl md:text-6xl font-bold uppercase italic tracking-tighter text-gray-200 opacity-50">
            Articles
          </h2>
          <div className="h-[2px] w-12 bg-gray-900 mt-2"></div>
        </div>

        <section className="space-y-0 border-t border-gray-900 mb-24">
          {posts.map((post, index) => {
            const numStr = String(index + 1).padStart(2, '0');
            return (
              <div key={post.slug} className="border-b border-gray-900 py-6 sm:py-8 group">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                  
                  <div className="flex items-start gap-4 md:gap-8">
                    <span className="font-mono text-xs sm:text-sm text-gray-600 pt-1">
                      [{numStr}]
                    </span>
                    <div>
                      <Link href={`/blog/${post.slug}`} className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-gray-300 transition-colors uppercase">
                        {post.title}
                      </Link>
                      <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-2xl font-normal leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 sm:text-right ml-8 sm:ml-0">
                    <span className="text-xs uppercase px-2.5 py-1 rounded border border-gray-800 bg-gray-900/50 text-gray-400 font-mono">
                      {post.date}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </section>

        <Footer />
      </main>
    </div>
  );
}