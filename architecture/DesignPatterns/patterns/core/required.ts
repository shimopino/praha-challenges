type Props = {
  name: string;
  age?: number;
  admin?: false;
};

type RequiredProps = Required<Props>;
