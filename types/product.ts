export type ProductType = {
  id: number;
  productName: string;
  slug: string;
  description: string;
  descriptionCorta: string | null;
  img: {
    data: {
      id: number;
      attributes: {
        url: string;
      };
    }[];
  } | null;
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
