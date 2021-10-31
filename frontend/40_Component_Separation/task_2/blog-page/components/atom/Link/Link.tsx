import styles from "./Link.module.scss";

interface LinkProps {
  text: string;
  href: string;
}

export const Link = ({ text, href }: LinkProps) => {
  return (
    <>
      <a href={href} className={styles.link}>
        {text}
      </a>
    </>
  );
};
