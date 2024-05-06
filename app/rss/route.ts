import { baseUrl } from 'app/sitemap'
import { getLegoEntries } from 'app/lego/utils'

export async function GET() {
  let allEntries = await getLegoEntries()

  const itemsXml = allEntries
    .sort((a, b) => {
      if (new Date(a.metadata.sortIndex) > new Date(b.metadata.sortIndex)) {
        return -1
      }
      return 1
    })
    .map(
      (entry) =>
        `<item>
          <title>${entry.metadata.title}</title>
          <link>${baseUrl}/blog/${entry.slug}</link>
          <description>${entry.metadata.summary || ''}</description>
          <pubDate>${new Date(
            entry.metadata.publishedAt
          ).toUTCString()}</pubDate>
        </item>`
    )
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>My Portfolio</title>
        <link>${baseUrl}</link>
        <description>This is my portfolio RSS feed</description>
        ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
