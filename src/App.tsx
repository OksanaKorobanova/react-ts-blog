import { useEffect, useState } from 'react';
import { get } from './util/http';
import BlogPosts, { BlogPost } from './components/BlogPosts';
import fetchingImg from './assets/data-fetching.png';
import ErrorMessage from './components/ErrorMessage';

type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

const url = 'https://jsonplaceholder.typicode.com/posts';

function App() {
  const [fetchedData, setFetchedData] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const data = (await get(url)) as RawDataBlogPost[];
        const blogPosts: BlogPost[] = data.map((rawPost) => ({
          id: rawPost.id,
          title: rawPost.title,
          text: rawPost.body,
        }));
        setFetchedData(blogPosts);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);
  return (
    <main>
      <img src={fetchingImg} alt='data fetching img' />
      {error && <ErrorMessage text={error} />}
      {isLoading && <p id='loading-fallback'>Fetching posts...</p>}
      {fetchedData.length > 0 && <BlogPosts posts={fetchedData} />}
    </main>
  );
}

export default App;
