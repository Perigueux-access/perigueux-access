// api/google-photos.js
// Serverless function Vercel - Récupère les photos Google Places
// Version avec logs d'erreur détaillés pour débug

export default async function handler(req, res) {
  // CORS
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

  // 🔍 DEBUG : Vérifier que la clé est bien lue
  if (!apiKey) {
    return res.status(500).json({
      error: 'GOOGLE_PLACES_API_KEY non trouvée dans les variables d\'environnement',
      debug: 'La variable n\'existe pas sur Vercel ou le déploiement n\'a pas été rafraîchi',
    });
  }

  // 🔍 DEBUG : Afficher les premiers caractères de la clé (sans la compromettre)
  const keyHint = `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`;

  try {
    const query = address ? `${name}, ${address}` : `${name} Périgueux`;

    console.log(`[google-photos] Recherche: "${query}" avec clé ${keyHint}`);

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

    const responseText = await searchRes.text();

    if (!searchRes.ok) {
      // 🔍 DEBUG : Renvoyer l'erreur exacte de Google
      console.error(`[google-photos] Erreur Google ${searchRes.status}:`, responseText);
      return res.status(500).json({
        error: 'Erreur Google API',
        googleStatus: searchRes.status,
        googleError: responseText,
        queryUsed: query,
        keyHint: keyHint,
      });
    }

    let searchData;
    try {
      searchData = JSON.parse(responseText);
    } catch (e) {
      return res.status(500).json({
        error: 'Réponse Google invalide',
        response: responseText,
      });
    }

    if (!searchData.places || searchData.places.length === 0) {
      return res.status(200).json({
        photos: [],
        found: false,
        message: `Aucun lieu trouvé pour "${query}"`,
      });
    }

    const place = searchData.places[0];
    const photos = place.photos || [];

    const photoUrls = photos.slice(0, 5).map((photo) => {
      return `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=800&key=${apiKey}`;
    });

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    return res.status(200).json({
      photos: photoUrls,
      found: true,
      placeName: place.displayName?.text,
      placeAddress: place.formattedAddress,
      photoCount: photos.length,
    });
  } catch (error) {
    console.error('[google-photos] Exception:', error);
    return res.status(500).json({
      error: 'Erreur serveur',
      message: error.message,
      stack: error.stack,
    });
  }
}
