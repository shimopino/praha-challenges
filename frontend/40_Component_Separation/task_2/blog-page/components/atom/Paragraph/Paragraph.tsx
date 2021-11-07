import styles from "./Paragraph.module.scss";

type ParagraphProps = {
  paragraph: string;
};

export const Paragraph = ({ paragraph }: ParagraphProps) => {
  return (
    <>
      <p className={styles.paragraph}>{paragraph}</p>
    </>
  );
};
