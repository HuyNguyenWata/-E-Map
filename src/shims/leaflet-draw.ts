// leaflet-draw's UMD build only attaches itself to the global `L` object and
// exposes no real JS export. react-leaflet-draw does `import Draw from
// "leaflet-draw"` purely for that side effect, which trips up strict ESM
// bundlers (rolldown) that reject a missing default export. This shim runs
// the side effect and hands back a dummy default so resolution succeeds.
import "leaflet-draw/dist/leaflet.draw.js";

export default {};
