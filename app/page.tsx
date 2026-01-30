import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/src/sanity/client";

const NEWS_QUERY = `*[
  _type == "news"
  && defined(slug.current)
]|order(publishedAt desc)[0...9]{_id, title, slug, publishedAt}`;

// revalidate: 30 означає, що сайт буде перевіряти оновлення в базі раз на 30 секунд (ISR)
const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const news = await client.fetch<SanityDocument[]>(NEWS_QUERY, {}, options);

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Новини</h1>
      <ul className="flex flex-col gap-y-4">
        {news.map((post) => (
          <li className="p-4 border rounded-xl hover:shadow-md transition shadow-sm" key={post._id}>
            {/* ВИПРАВЛЕНО ШЛЯХ: додано /news/ */}
            <Link href={`/news/${post.slug.current}`}>
              <h2 className="text-xl font-semibold text-blue-600">{post.title}</h2>
              <p className="text-gray-500 text-sm">
                {post.publishedAt 
                  ? new Date(post.publishedAt).toLocaleDateString('uk-UA') 
                  : "Щойно опубліковано"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      {news.length === 0 && <p>Поки що новин немає...</p>}
    </main>
  );
}