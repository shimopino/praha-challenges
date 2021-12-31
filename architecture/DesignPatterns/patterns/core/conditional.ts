type PPSNumber = {
  number: string;
};

type NameOrPPSNumber<T extends string | number> = T extends number
  ? PPSNumber
  : string;

const loginInfo: NameOrPPSNumber<1> = {
  number: "123",
};
