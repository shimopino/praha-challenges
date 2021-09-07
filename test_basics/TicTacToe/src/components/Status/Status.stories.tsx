import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Status, Props } from './Status';

export default {
  component: Status,
  title: 'Status',
} as Meta;

const Template: Story<Props> = ({ status }: Props) => (
  <Status {...{ status }} />
);

export const Default = Template.bind({});
Default.args = {
  status: 'Next Player: O',
};

export const Winner = Template.bind({});
Winner.args = {
  status: 'Winner: X',
};

export const Draw = Template.bind({});
Draw.args = {
  status: 'Draw!',
};
