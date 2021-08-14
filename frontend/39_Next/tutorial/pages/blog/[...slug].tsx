import { NextPage } from 'next';
import { useRouter } from 'next/router';

const BlogPage: NextPage = () => {
  const router = useRouter();
  const slug = router.query;

  console.log(slug);

  return (
    <div>
      <h1>The BlogPage in </h1>
    </div>
  );
};

export default BlogPage;
