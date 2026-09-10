import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = 'https://wxwreak.vercel.app'

  const staticRoutes = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
    },
  ]

  const postsDirectory = path.join(process.cwd(), 'posts')
  let blogRoutes: MetadataRoute.Sitemap = []

  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory)
    const mdFiles = filenames.filter(file => file.endsWith('.md'))

    blogRoutes = mdFiles.map((filename) => {
      const slug = filename.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, filename)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        url: `${BASE_URL}/blog/${slug}`,
        lastModified: data.date ? new Date(data.date) : fs.statSync(fullPath).mtime,
      }
    })
  }

  return [...staticRoutes, ...blogRoutes]
}
