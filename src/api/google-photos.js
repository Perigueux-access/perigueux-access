// api/google-photos.js
// Serverless function Vercel - Récupère les photos Google Places
// Cette fonction tourne côté serveur, la clé API reste cachée
 
export default async function handler(req, res) {
  // CORS - autoriser les appels depuis ton site
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
 
  const { name, address } = req.query;
 
  if (!name) {
    return res.status(400).json({ error: 'Paramètre "name" manquant' });
  }
 
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Clé API non configurée' });
  }
 
  try {
    // 1. Rechercher le lieu avec Places API (New) - Text Search
    const query = address ? `${name}, ${address}` : `${name} Périgueux`;
 
    const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.photos,places.formattedAddress',
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: 'fr',
        regionCode: 'FR',
        maxResultCount: 1,
      }),
    });
 
    if (!searchRes.ok) {
      const errText = await searchRes.text();
      console.error('Google Search error:', errText);
      return res.status(500).json({ error: 'Erreur recherche Google', photos: [] });
    }
 
    const searchData = await searchRes.json();
 
    if (!searchData.places || searchData.places.length === 0) {
      return res.status(200).json({ photos: [], found: false });
    }
 
    const place = searchData.places[0];
    const photos = place.photos || [];
 
    // 2. Construire les URLs des photos (max 5)
    const photoUrls = photos.slice(0, 5).map((photo) => {
      return `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=800&key=${apiKey}`;
    });
 
    // Mise en cache côté navigateur (1 heure)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
 
    return res.status(200).json({
      photos: photoUrls,
      found: true,
      placeName: place.displayName?.text,
      placeAddress: place.formattedAddress,
    });
  } catch (error) {
    console.error('Erreur API Google:', error);
    return res.status(500).json({ error: 'Erreur serveur', photos: [] });
  }
}

