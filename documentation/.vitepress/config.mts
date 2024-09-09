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
      { text: "Download Sora", link: "/" },
      { text: "Documentation", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        items: [
          {
            text: "Introduction to SORA",
            link: "/getting-started/introduction",
          },
          { text: "Installation", link: "/getting-started/installation" },
          { text: "Quick Start Guide", link: "/getting-started/quick-start" },
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
          { text: "Config", link: "/features/config" },
          { text: "Logs", link: "/features/logs" },
          { text: "About", link: "/features/logs" },
        ],
      },
      {
        text: "Guides",
        items: [
          { text: "Basic Usage", link: "/guides/basic-usage" },
          { text: "Advanced Techniques", link: "/guides/advanced-techniques" },
        ],
      },
      {
        text: "Contribute",
        items: [
          { text: "How to Contribute", link: "/contribute/how-to-contribute" },
          { text: "Reporting Issues", link: "/contribute/reporting-issues" },
        ],
      },
      {
        text: "About",
        items: [
          { text: "About SORA", link: "/about/about-sora" },
          { text: "Changelog", link: "/about/changelog" },
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
