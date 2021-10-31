import clsx from "clsx";
import styles from "./Label.module.scss";

interface LabelProps {
  text: string;
  href?: string;
}

export const Label = ({ text, href = "#" }: LabelProps) => {
  return (
    <>
      <a href={href} className={clsx(styles.label)}>
        {text}
      </a>
    </>
  );
};
