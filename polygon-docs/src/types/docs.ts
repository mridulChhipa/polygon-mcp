export interface DocNavItem {
  title: string;
  href: string;
  badge?: string;
  isNew?: boolean;
}

export interface DocSection {
  title: string;
  iconName: string;
  items: DocNavItem[];
}

export interface TableOfContentItem {
  id: string;
  title: string;
  level: number;
}

export interface DocPageContent {
  slug: string;
  title: string;
  description: string;
  category: string;
  lastUpdated?: string;
  toc: TableOfContentItem[];
  prevPage?: { title: string; href: string };
  nextPage?: { title: string; href: string };
  content: React.ReactNode | string;
}
