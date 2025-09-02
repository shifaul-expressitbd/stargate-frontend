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
      test: 'error'
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        laptop: {
          name: 'Laptop',
          styles: {
            width: '1024px',
            height: '768px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
      defaultViewport: 'desktop',
    },
    layout: 'fullscreen',
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