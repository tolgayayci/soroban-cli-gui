import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Sora - Documentation",
  description: "Sora Documentation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: false,
    logo: {
      light: "/images/sora-dark.svg",
      dark: "/images/sora-light.svg",
    },

    nav: [
      { text: "Download Sora", link: "/" },
      { text: "Documentation", link: "/markdown-examples" },
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
        text: "Guides",
        items: [
          { text: "Using VsCode Extension", link: "/markdown-examples" },
          { text: "Installing Soroban", link: "/api-examples" },
          { text: "Installing Sora", link: "/api-examples" },
        ],
      },
      {
        text: "Pages",
        items: [
          { text: "Projects", link: "/markdown-examples" },
          { text: "Identities", link: "/api-examples" },
          { text: "Contracts", link: "/api-examples" },
          { text: "Events", link: "/api-examples" },
          { text: "Lab", link: "/api-examples" },
          { text: "Config", link: "/api-examples" },
          { text: "Logs", link: "/api-examples" },
          { text: "About", link: "/api-examples" },
        ],
      },
      {
        text: "Troubleshooting",
        items: [
          { text: "Common Issues", link: "/markdown-examples" },
          { text: "Frequently Asked Questions", link: "/api-examples" },
          { text: "Contributions", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/tolgayayci/sora" },
      {
        icon: "discord",
        link: "https://discord.com/channels/897514728459468821/1222543548188983448/1222543548188983448",
      },
      { icon: "youtube", link: "https://youtube.com/##" },
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
