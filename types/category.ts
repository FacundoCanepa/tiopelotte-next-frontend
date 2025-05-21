export type Category = {
  categoryNames: string;
  slug: string;
  description : string ;
  mainImage: {
    url: string;
    alternativeText?: string;
  };
};
