import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Agentic AI for Leaders',
  tagline: 'Architecting SIEHS\'s AI-Enabled Organization',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  // GitHub Pages deployment
  url: 'https://EnggQasim.github.io',
  baseUrl: '/agentic-ai-leaders-training/',
  organizationName: 'EnggQasim',
  projectName: 'agentic-ai-leaders-training',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
      ur: {
        label: 'اردو',
        direction: 'rtl',
        htmlLang: 'ur-PK',
      },
    },
  },

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        docsRouteBasePath: '/docs',
        indexBlog: false,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/EnggQasim/agentic-ai-leaders-training/tree/master/frontend/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'SIEHS AI Training',
      logo: {
        alt: 'SIEHS Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Training',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/EnggQasim/agentic-ai-leaders-training',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Training Days',
          items: [
            {
              label: 'Day 1: Prompt Engineering',
              to: '/docs/day1',
            },
            {
              label: 'Day 2: n8n Automation',
              to: '/docs/day2',
            },
            {
              label: 'Day 3: AI Deployment',
              to: '/docs/day3',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'SIEHS Official',
              href: 'https://www.siehs.org',
            },
            {
              label: '1122 Emergency',
              href: 'https://www.siehs.org',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/EnggQasim/agentic-ai-leaders-training',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SIEHS Agentic AI Training. Built for Healthcare Leaders.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'json', 'bash', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
