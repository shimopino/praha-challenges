import { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <h1>Hello Next App</h1>
      <ul>
        <li>
          <Link href="/users">Users</Link>
        </li>
        <li>
          <Link href="/collections">Collections</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
