import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { action } from '@storybook/addon-actions';
import { Move, Props } from './Move';

export default {
  component: Move,
  title: 'Move',
} as Meta;

const Template: Story<Props> = ({ history, jumpTo }: Props) => (
  <Move {...{ history, jumpTo }} />
);

export const Default = Template.bind({});
Default.args = {
  history: [
    {
      squares: Array(9).fill(null),
    },
  ],
  jumpTo: action('Move Clicked'),
};

export const SecondTern = Template.bind({});
SecondTern.args = {
  ...Default.args,
  history: [
    {
      squares: Array(9).fill(null),
    },
    {
      squares: Array(9).fill(null),
    },
  ],
};
