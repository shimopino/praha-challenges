import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Link } from "./Link";

export default {
  title: "Atom/Link",
  component: Link,
} as ComponentMeta<typeof Link>;

const Template: ComponentStory<typeof Link> = (args) => {
  return <Link {...args} />;
};

export const ReadMore = Template.bind({});
ReadMore.args = {
  text: "Read more",
  href: "#",
};
