import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Sora - Documentation",
  description: "Sora Documentation",
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: false,
    logo: {
      light: "/sora-dark.svg",
      dark: "/sora-light.svg",
    },

    nav: [
      { text: "Download Sora", link: "/getting-started/installation" },
      { text: "Documentation", link: "/getting-started/quick-start" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Installation", link: "/getting-started/installation" },
          { text: "Quick Start", link: "/getting-started/quick-start" },
        ],
      },
      {
        text: "Core Features",
        items: [
          { text: "Projects", link: "/features/projects" },
          { text: "Identities", link: "/features/identities" },
          { text: "Contracts", link: "/features/contracts" },
          { text: "Events", link: "/features/events" },
          { text: "Lab", link: "/features/lab" },
          { text: "Network", link: "/features/network" },
          { text: "Logs", link: "/features/logs" },
          { text: "About", link: "/features/about" },
        ],
      },
      {
        text: "Guides",
        items: [
          { text: "Creating and Deploying Smart Contracts", link: "/guides/creating-deploying-smart-contracts" },
          { text: "Managing Multi-Signature Accounts", link: "/guides/managing-multisig-accounts" },
          { text: "Issuing and Managing Custom Assets", link: "/guides/issuing-managing-custom-assets" },
        ],
      },
      {
        items: [
          { text: "How to Contribute", link: "/how-to-contribute" },
          { text: "Changelog", link: "/changelog" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/tolgayayci/sora" },
      {
        icon: "discord",
        link: "https://discord.com/channels/897514728459468821/1222543548188983448/1222543548188983448",
      },
    ],
  },

  head: [
    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-6NMRGHLKPJ",
      },
    ],
    [
      "script",
      {},
      ` window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-6NMRGHLKPJ');`,
    ],
  ],
});
