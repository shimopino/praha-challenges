import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Game } from './Game';

export default {
  component: Game,
  title: 'Game',
} as Meta;

const Template: Story = () => <Game />;

export const Default = Template.bind({});
