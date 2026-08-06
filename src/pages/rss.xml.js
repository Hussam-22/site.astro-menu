import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = (await getCollection("blog"))
    .filter((post) => !post.data.draft && post.data.publishDate < new Date())
    .sort(
      (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
    );

  return rss({
    title: "Astro-Menu Blog",
    description:
      "Insights on QR menus and digital transformation for food businesses.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.snippet,
      pubDate: post.data.publishDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: "<language>en-us</language>",
  });
}
