// Replace your-framework with the framework you are using (e.g., nextjs, vue3-vite)
import type { Meta, StoryObj } from '@storybook/react';

import Input from '@common/Input';

const meta: Meta<typeof Input> = {
  component: Input,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Input>;

export const ExperimentalFeatureStory: Story = {
  /**
   * 👇 This particular story will have these tags applied:
   *    - experimental
   *    - autodocs (inherited from meta)
   *    - dev (inherited from meta)
   *    - test (inherited from meta)
   */
  tags: ['experimental'],
};