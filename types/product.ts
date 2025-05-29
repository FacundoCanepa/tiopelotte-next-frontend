export type ProductType = {
  id: number;
  productName: string;
  slug: string;
  description: string;
  descriptionCorta: string | null;

  img: {
    id: number;
    url: string;
  }[]; // imagen principal (usás array plano)

  img_carousel?: {
    id: number;
    url: string;
    alternativeText?: string;
  }[]; // carrusel como array directo

  unidadMedida: string;
  taste: string;
  price: number;
  active: boolean;
  isFeatured: boolean | null;
  isOffer: boolean | null;

  category: {
    id: number;
    categoryNames: string;
    slug: string;
  };
};
