// https://github.com/vercel/next.js/issues/18393

import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Icon } from "./Icon";

export default {
  title: "Atom/Icon",
  component: Icon,
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = (args) => {
  return <Icon {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=731&q=80",
  alt: "avatar",
};
