import { NextPage } from 'next';
import { useRouter } from 'next/router';

const CollectionPage: NextPage = () => {
  const router = useRouter();
  const query = router.query;
  const collectionId = query.collectionId;

  const loadBookHandler = () => {
    // router.push('/collections/1/10');
    // router.replace('/collections/1/10');
    router.push({
      pathname: '/collections/[collectionId]/[bookId]',
      query: { collectionId: 1, bookId: 10 },
    });
  };

  return (
    <div>
      <h1>The Collection: {collectionId}</h1>
      <button onClick={loadBookHandler}>Load Book A</button>
    </div>
  );
};

export default CollectionPage;
