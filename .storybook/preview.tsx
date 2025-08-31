import type { Preview } from '@storybook/react-vite';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../src/lib/providers/theme-provider';
import { store } from '../src/lib/store';

import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  decorators: [
    (Story, context) => {
      const initialEntries = context.parameters?.initialEntries || ['/'];

      return (
        <MemoryRouter initialEntries={initialEntries}>
          <Provider store={store}>
            <ThemeProvider>
              <Story />
            </ThemeProvider>
          </Provider>
        </MemoryRouter>
      );
    },
  ],
};

export default preview;