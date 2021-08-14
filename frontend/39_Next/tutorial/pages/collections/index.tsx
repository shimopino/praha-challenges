import { NextPage } from 'next';
import Link from 'next/link';

const CollectionsPage: NextPage = () => {
  const collections = [
    { id: 1, name: 'sample 1' },
    { id: 2, name: 'sample 2' },
  ];

  return (
    <div>
      <h1>The Collections Page</h1>
      <ul>
        {collections.map((collection) => (
          <li key={collection.id}>
            {/* <Link href={`/collections/${collection.id}`}>
              {collection.name}
            </Link> */}
            <Link
              href={{
                pathname: 'collections/[collectionId]',
                query: { collectionId: collection.id },
              }}
            >
              {collection.name}
            </Link>
          </li>
        ))}
        <li></li>
      </ul>
    </div>
  );
};

export default CollectionsPage;
