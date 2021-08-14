import { NextPage } from 'next';
import { useRouter } from 'next/router';

const UserPage: NextPage = () => {
  const router = useRouter();

  const pathname = router.pathname;
  const query = router.query;
  const userId = router.query.userId;

  console.log(query);
  console.log(userId);

  return (
    <div>
      <h1>The User Page: {userId}</h1>
    </div>
  );
};

export default UserPage;
