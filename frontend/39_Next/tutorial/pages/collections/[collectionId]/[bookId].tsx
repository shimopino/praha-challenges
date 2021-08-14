import { NextPage } from 'next';
import { useRouter } from 'next/router';

const BookPage: NextPage = () => {
  const router = useRouter();
  const query = router.query;
  const bookId = query.bookId;
  const collectionId = query.collectionId;

  return (
    <div>
      <h1>
        The Book: {bookId} in the Collection: {collectionId}
      </h1>
    </div>
  );
};

export default BookPage;
