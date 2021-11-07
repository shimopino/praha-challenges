import Image from "next/image";
import styles from "./Icon.module.scss";

type IconProps = {
  src: string;
  alt: string;
};

export const Icon = ({ src, alt }: IconProps) => {
  return (
    <>
      <Image src={src} alt={alt} className={styles.icon} layout="fill" />
    </>
  );
};
