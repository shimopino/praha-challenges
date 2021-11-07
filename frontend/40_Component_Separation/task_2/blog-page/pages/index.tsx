import type { NextPage } from "next";
import { Icon } from "../components/atom/Icon/Icon";
import { Label } from "../components/atom/Label/Label";
import { Link } from "../components/atom/Link/Link";

const Home: NextPage = () => {
  return (
    <>
      <Label text="Laravel" />
      <br />
      <Link
        text={"ReadMore"}
        href={"https://tailwindcomponents.com/component/blog-page/landing"}
      />
      <br />
      <Icon
        src={
          "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=731&q=80"
        }
        alt={"avatar"}
      />
    </>
  );
};

export default Home;
