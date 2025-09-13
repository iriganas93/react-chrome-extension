import { withUI } from '@extension/ui';

export default withUI({
  content: ['index.html', 'src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        accent: '#0B627C',
        test: {
          light: '#0B627C',
          DEFAULT: '#0B627C', // brand color for `text-brand`
          dark: '#0B627C',
        },
      },
    },
  },
});
