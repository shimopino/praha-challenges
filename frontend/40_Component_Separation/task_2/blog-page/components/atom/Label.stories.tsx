import { Label } from "./Label";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Example/Label",
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
