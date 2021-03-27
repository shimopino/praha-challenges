import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { action } from '@storybook/addon-actions';
import { Square, Props } from './Square';

export default {
  component: Square,
  title: 'Square',
} as Meta;

const Template: Story<Props> = ({ value, onClick }: Props) => (
  <Square {...{ value, onClick }} />
);

export const Default = Template.bind({});
Default.args = {
  value: null,
  onClick: action('Square Area is Clicked'),
};

export const X = Template.bind({});
X.args = {
  ...Default.args,
  value: 'X',
};

export const O = Template.bind({});
O.args = {
  ...Default.args,
  value: 'O',
};

// 以下はTypeScriptでコンパイルエラーが発生する
// export const Triange = Template.bind({});
// Triange.args = {
//   ...Default.args,
//   value: '△',
// };
