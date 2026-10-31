import { DocSection } from '@/types/docs';

export const navigationData: DocSection[] = [
  {
    title: 'Getting Started',
    iconName: 'Rocket',
    items: [
      { title: 'Overview', href: '/docs/getting-started/overview' },
      { title: 'Quickstart (5 Min)', href: '/docs/getting-started/quickstart', badge: 'Fast Track' },
      { title: 'Installation', href: '/docs/getting-started/installation' },
      { title: 'Configuration & Auth', href: '/docs/getting-started/configuration' },
      { title: 'Client Integration', href: '/docs/getting-started/client-setup', badge: 'Clients' },
    ],
  },
  {
    title: 'Core Architecture',
    iconName: 'Layers',
    items: [
      { title: 'Two-Tier Tool Design', href: '/docs/architecture/two-tier-design', badge: 'Core' },
      { title: 'Protocol & Signing', href: '/docs/architecture/protocol-and-auth' },
      { title: 'Preflight Verification Engine', href: '/docs/architecture/preflight-engine' },
      { title: 'Working Copy & Package Lifecycle', href: '/docs/architecture/working-copy-lifecycle' },
    ],
  },
  {
    title: 'MCP Tools Reference',
    iconName: 'Wrench',
    items: [
      { title: 'Workflow Tools (Tier 1)', href: '/docs/tools/workflows', badge: 'Tier 1' },
      { title: 'Primitive Tools (Tier 2)', href: '/docs/tools/primitives', badge: 'Tier 2' },
      { title: 'Resources & Prompts', href: '/docs/tools/resources-and-prompts' },
    ],
  },
  {
    title: 'Guides & Tutorials',
    iconName: 'BookOpen',
    items: [
      { title: 'End-to-End Problem Walkthrough', href: '/docs/guides/full-walkthrough', badge: 'Tutorial' },
      { title: 'Directory Sync Guide', href: '/docs/guides/directory-sync' },
      { title: 'testlib.h Best Practices', href: '/docs/guides/testlib-best-practices' },
      { title: 'Codeforces Audit Checklist', href: '/docs/guides/codeforces-checklist' },
    ],
  },
  {
    title: 'Transports & Deployment',
    iconName: 'Server',
    items: [
      { title: 'Stdio Transport (Local)', href: '/docs/deployment/stdio-transport' },
      { title: 'Streamable HTTP (Remote)', href: '/docs/deployment/http-transport' },
      { title: 'Docker Deployment', href: '/docs/deployment/docker' },
    ],
  },
  {
    title: 'Troubleshooting & FAQ',
    iconName: 'HelpCircle',
    items: [
      { title: 'Common Errors & Fixes', href: '/docs/troubleshooting/common-errors', badge: 'Essential' },
      { title: 'Frequently Asked Questions', href: '/docs/troubleshooting/faq' },
    ],
  },
];
