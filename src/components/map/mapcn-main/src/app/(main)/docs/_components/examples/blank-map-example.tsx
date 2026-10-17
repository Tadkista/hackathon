import { Map, MapGeoJSON } from "@/registry/map";
import { WORLD_GEOJSON } from "@/lib/use-world-data";

export function BlankMapExample() {
  return (
    <div className="h-[420px] w-full">
      {/* `blank` is a transparent canvas — add your own layers on top. */}
      <Map blank center={[10, 25]}>
        <MapGeoJSON data={WORLD_GEOJSON} />
      </Map>
    </div>
  );
}
