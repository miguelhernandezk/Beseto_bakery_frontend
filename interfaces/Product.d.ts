export interface Product {
  readonly _id: string;
  name: string;
  flavor1: string;
  flavor2: string | null | undefined;
  fill: 'double' | 'single' | 'N/A';
  persons: number;
  variant: number;
  picture: string[];
  description: string;
  price: number;
  tags: string[] | null;
  category: string; // ID of category
}
