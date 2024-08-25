import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '2a0'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'd61'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'd42'),
            routes: [
              {
                path: '/docs/features/ai-command-constructor',
                component: ComponentCreator('/docs/features/ai-command-constructor', 'e84'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/features/contract-interactions',
                component: ComponentCreator('/docs/features/contract-interactions', '0ca'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/features/event-monitoring',
                component: ComponentCreator('/docs/features/event-monitoring', '273'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/features/identity-management',
                component: ComponentCreator('/docs/features/identity-management', 'be7'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/features/project-management',
                component: ComponentCreator('/docs/features/project-management', '675'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/features/sorai-assistant',
                component: ComponentCreator('/docs/features/sorai-assistant', '163'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/getting-started/installation',
                component: ComponentCreator('/docs/getting-started/installation', 'f1f'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/getting-started/quick-start',
                component: ComponentCreator('/docs/getting-started/quick-start', '835'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/guides/advanced-usage',
                component: ComponentCreator('/docs/guides/advanced-usage', 'c18'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/guides/using-vscode-extension',
                component: ComponentCreator('/docs/guides/using-vscode-extension', 'dea'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/troubleshooting/common-issues',
                component: ComponentCreator('/docs/troubleshooting/common-issues', 'eaf'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/troubleshooting/faq',
                component: ComponentCreator('/docs/troubleshooting/faq', '74d'),
                exact: true,
                sidebar: "docsSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
