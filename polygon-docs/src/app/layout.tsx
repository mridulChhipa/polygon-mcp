import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Polygon MCP Server Documentation | Codeforces Problem Automation',
  description:
    'Complete documentation, architecture guide, and API reference for the Codeforces Polygon Model Context Protocol (MCP) Server.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#FFFDF5] dark:bg-[#0F1015] text-black dark:text-white antialiased selection:bg-[#FFE600] selection:text-black">
        {children}
      </body>
    </html>
  );
}
