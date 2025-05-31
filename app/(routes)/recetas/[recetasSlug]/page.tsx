// app/(routes)/recetas/[recetasSlug]/page.tsx
import RecipeDetail from "./components/RecipeDetail";
import { generateRecipeMetadata } from "./components/generateMetadata";

type Props = { params: { recetasSlug: string } };

export async function generateMetadata({ params }: Props) {
  return await generateRecipeMetadata(params.recetasSlug);
}

export default function Page({ params }: Props) {
  return <RecipeDetail slug={params.recetasSlug} />;
}
