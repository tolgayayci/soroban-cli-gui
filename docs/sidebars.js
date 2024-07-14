/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: "category",
      label: "Getting Started",
      items: ["getting-started/installation", "getting-started/quick-start"],
    },
    {
      type: "category",
      label: "Features",
      items: [
        "features/project-management",
        "features/identity-management",
        "features/contract-interactions",
        "features/event-monitoring",
        "features/ai-command-constructor",
        "features/sorai-assistant",
      ],
    },
    {
      type: "category",
      label: "Guides",
      items: ["guides/using-vscode-extension", "guides/advanced-usage"],
    },
    {
      type: "category",
      label: "Troubleshooting",
      items: ["troubleshooting/common-issues", "troubleshooting/faq"],
    },
  ],
};

export default sidebars;
