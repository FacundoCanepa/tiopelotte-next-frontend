export interface RecetaType {
  id: number;
  titulo: string;
  slug: string;
  descripcion: string;
  tiempo: string;
  porciones: string;
 preparacion: string;
  img: {
    url: string;
    alternativeText?: string;
    caption?: string;
  } | null;
  products: {
    id: number;
    productName: string;
    slug: string;
    img: {
      url: string;
      alternativeText?: string;
    }[];
  }[];
}
