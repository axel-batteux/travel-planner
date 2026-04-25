async function getSchema() {
  const url = "https://ddcuzhlujzpjnvqkoshk.supabase.co/rest/v1/?apikey=sb_publishable_7_V0rLzD6w23j8bDhJyrHQ_iDL0nwcC";
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Root keys:", Object.keys(data));
    if (data.definitions) console.log("Has definitions");
    if (data.components && data.components.schemas) {
       console.log("Components schemas:", Object.keys(data.components.schemas));
       const it = data.components.schemas.itinerary;
       if (it) {
         console.log("Itinerary columns:", Object.keys(it.properties || {}));
       }
    }
  } catch (err) {
    console.error(err);
  }
}
getSchema();
