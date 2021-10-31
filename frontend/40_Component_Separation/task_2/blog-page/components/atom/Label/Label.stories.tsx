import { Label } from "./Label";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Atom/Label",
  component: Label,
} as ComponentMeta<typeof Label>;

const Template: ComponentStory<typeof Label> = (args) => {
  return <Label {...args} />;
};

export const Laravel = Template.bind({});
Laravel.args = {
  text: "Laravel",
  href: "#",
};

export const Design = Template.bind({});
Design.args = {
  text: "Design",
  href: "#",
};

export const PHP = Template.bind({});
PHP.args = {
  text: "PHP",
  href: "#",
};

export const Testing = Template.bind({});
Testing.args = {
  text: "Testing",
  href: "#",
};
