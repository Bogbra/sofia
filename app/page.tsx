import HomeContent from "./HomeContent";
import { getArtworks } from "@/lib/artworks";

export default function HomePage() {
  const artworks = getArtworks();
  return <HomeContent artworks={artworks} />;
}
