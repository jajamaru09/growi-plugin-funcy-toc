export interface HeadingItem {
  depth: number; // 1..6
  id: string;
  text: string;
}

export interface TocData {
  title: string;
  min: number;
  max: number;
  headings: HeadingItem[];
}

export interface TocNode extends HeadingItem {
  children: TocNode[];
}
