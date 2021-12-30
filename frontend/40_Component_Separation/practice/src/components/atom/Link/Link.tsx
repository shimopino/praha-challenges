import {link} from './Link.css'

interface LinkProps {
  url: string;
  children: React.ReactNode;
  accessibilityLabel?: string;
}

export const Link = ({ url, children, accessibilityLabel }: LinkProps) => {
  return <a className={link} href={url} aria-labeledby={accessibilityLabel}>
      {children}
  </a>;
};
