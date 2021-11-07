import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Paragraph } from "./Paragraph";

export default {
  title: "Atom/Paragraph",
  component: Paragraph,
} as ComponentMeta<typeof Paragraph>;

const Template: ComponentStory<typeof Paragraph> = (args) => {
  return <Paragraph {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  paragraph:
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!",
};
