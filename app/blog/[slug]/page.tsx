import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

function getPostData(slug: string) {
  try {
    const postDirectory = path.join(process.cwd(), 'posts');
    const fullPath = path.join(postDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      slug, 
      content,
      title: data.title || 'Untitled Post',
      date: data.date || '',
      description: data.description || '',
    };
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostData(slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} | Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  if (!fs.existsSync(postsDirectory)) return [];
  const filenames = fs.readdirSync(postsDirectory);
  return filenames.map((filename) => ({
    slug: filename.replace(/\.md$/, ''),
  }));
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostData(slug);
  
  if (!post) {
    return (
      <div className="bg-black text-white selection:bg-white selection:text-black min-h-screen font-sans antialiased flex items-center justify-center">
        <p className="font-mono text-gray-500 uppercase tracking-widest">[ Article not found ]</p>
      </div>
    );
  }

  const processedContent = await remark()
    .use(html)
    .process(post.content);
  const contentHtml = processedContent.toString();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: 'wxwreak',
      url: 'https://wxwreak.vercel.app',
    },
  };

  return (
    <div className="bg-black text-white selection:bg-white selection:text-black min-h-screen font-sans antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 md:pt-32">
        
        <div className="mb-12">
          <Link 
            href="/blog" 
            className="font-mono text-xs sm:text-sm text-gray-500 hover:text-white transition uppercase tracking-widest inline-block"
          >
            &larr; [ Back to the list of articles ]
          </Link>
        </div>

        <header className="mb-16 border-b border-gray-900 pb-10">
          <span className="text-xs uppercase px-2.5 py-1 rounded border border-gray-800 bg-gray-900/50 text-gray-400 font-mono inline-block mb-4">
            {post.date}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase italic text-white leading-tight">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-gray-400 text-base sm:text-lg font-normal leading-relaxed mt-4 max-w-3xl">
              {post.description}
            </p>
          )}
        </header>

        <div 
          className="text-gray-300 space-y-6 text-base sm:text-lg leading-relaxed mb-24
            [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:italic [&_h2]:text-white [&_h2]:mt-12 [&_h2]:mb-4 
            [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:text-gray-400 [&_p]:leading-relaxed 
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
            [&_code]:text-blue-400 [&_code]:bg-gray-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
            [&_pre]:bg-gray-900 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-gray-800 [&_pre]:overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: contentHtml }} 
        />

        <Footer />
      </main>
    </div>
  );
}
