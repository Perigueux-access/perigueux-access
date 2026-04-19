import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Award, Users, Filter, Plus, Star, Accessibility, Eye, Ear, Brain, Search, X, Trophy, Sparkles, TrendingUp, Moon, Sun, Check, Target, Flame, Crown, User, ChevronRight, Navigation, Camera, Heart, Share2, ArrowUpDown, Locate, Phone, Route, Type, ZoomIn, FileText, Shield, Info } from 'lucide-react';

// ======================================================
// DONNÉES — 60+ lieux réels de Périgueux
// Sources officielles :
//  • Ville de Périgueux (perigueux.fr)
//  • Office de Tourisme du Grand Périgueux (liste PMR 2020)
//  • Acceslibre (beta.gouv.fr) — données publiques État français
//  • Petit Futé Périgueux
// ======================================================
const SEED_PLACES = [
  // === PARCS & JARDINS PUBLICS (13 parcs officiels de la ville) ===
  { id: 'parc1', name: 'Jardin des Arènes', type: 'parc', lat: 45.1858, lng: 0.7185, address: 'Rue de Turenne, 24000 Périgueux', disabilities: ['moteur', 'visuel', 'mental'], equipment: ['chemin_plat', 'bancs', 'toilettes_pmr', 'parking_pmr', 'aire_jeux_adaptee'], score: 5, reviews: [{user:'Thomas',rating:5,text:"Allées larges et planes autour de l'amphithéâtre antique. Aire de jeux et bassin."}], photos: [], hours: '7h-21h (été) / 7h-19h (hiver)', phone: '', quartier: 'Centre', verified: true, description: "Jardin public aménagé dans l'ancien amphithéâtre gallo-romain du Ier siècle (jusqu'à 20 000 spectateurs). Aire de jeux, bassin, classé Monuments Historiques." },
  { id: 'parc2', name: 'Jardin de Vésone', type: 'parc', lat: 45.1819, lng: 0.7164, address: "Rue du 26e Régiment d'Infanterie, 24000 Périgueux", disabilities: ['moteur', 'visuel', 'mental'], equipment: ['chemin_plat', 'bancs', 'allees_larges'], score: 5, reviews: [{user:'Sophie',rating:5,text:"Magnifique, allées larges autour de la Tour de Vésone. Très accessible."}], photos: [], hours: '7h-21h (été) / 7h-19h (hiver)', phone: '', quartier: 'Saint-Georges', verified: true, description: "Jardin de 6 440 m² autour du vestige antique de la Tour de Vésone (24m), temple dédié à la déesse Vesunna. Tilleuls, ifs, buis, Ginkgo Biloba." },
  { id: 'parc3', name: 'Parc Gamenson', type: 'parc', lat: 45.1912, lng: 0.7248, address: 'Avenue Pompidou, 24000 Périgueux', disabilities: ['moteur', 'mental'], equipment: ['chemin_plat', 'bancs', 'aire_jeux_adaptee', 'parking_pmr'], score: 4, reviews: [{user:'Julie',rating:4,text:"Grand parc familial avec agrès et jeux. Allées principales accessibles, quelques zones en pente."}], photos: [], hours: '7h-22h', phone: '', quartier: 'Gour de l\'Arche', verified: true, description: "Ancienne propriété de la famille de Gamenson (1876). Nombreux espaces de jeux familiaux (agrès, jeux de boule), 7 000 m² de prairie en gestion naturelle." },
  { id: 'parc4', name: 'Parc François-Mitterrand', type: 'parc', lat: 45.1828, lng: 0.7178, address: 'Cours Fénelon / Bd Georges-Saumande, 24000 Périgueux', disabilities: ['moteur', 'visuel', 'mental'], equipment: ['chemin_plat', 'bancs', 'allees_larges'], score: 5, reviews: [{user:'Antoine',rating:5,text:"Parfait pour une pause, trois jardins éphémères sur 6000m². Totalement plat."}], photos: [], hours: '7h-21h', phone: '', quartier: 'Saint-Georges', verified: true, description: "6 000 m² en trois jardins éphémères en forme de feuille de tulipier. Expositions en plein air, événements culturels." },
  { id: 'parc5', name: 'Jardin du Thouin (Jardin à la française)', type: 'parc', lat: 45.1845, lng: 0.7248, address: 'Rue Littré, 24000 Périgueux', disabilities: ['moteur', 'visuel'], equipment: ['chemin_plat', 'bancs', 'allees_larges'], score: 4, reviews: [], photos: [], hours: '7h-21h', phone: '', quartier: 'Centre', verified: true, description: "Jardin à la française, géométrique autour d'un bassin central. Vieux magnolias (80 ans), séquoia géant, cèdre bleu pleureur." },
  { id: 'parc6', name: "Jardin des Remparts (Square d'Amberg)", type: 'parc', lat: 45.1854, lng: 0.7238, address: 'Rue des Farges, 24000 Périgueux', disabilities: ['moteur'], equipment: ['bancs'], score: 3, reviews: [{user:'Paul',rating:3,text:"Belle vue mais espace surélevé, accès un peu pentu."}], photos: [], hours: '7h-21h', phone: '', quartier: 'Centre historique', verified: true, description: "Espace surélevé accroché au rempart médiéval. Rebaptisé en hommage à Amberg, ville jumelle de Périgueux." },
  { id: 'parc7', name: 'Square Jean-Jaurès', type: 'parc', lat: 45.1878, lng: 0.7236, address: 'Place Louis Magne, 24000 Périgueux', disabilities: ['moteur', 'visuel'], equipment: ['chemin_plat', 'bancs'], score: 4, reviews: [], photos: [], hours: '24h/24', phone: '', quartier: 'Centre', verified: true, description: "Petit square ombragé derrière le Théâtre de l'Odyssée, place Louis Magne." },
  { id: 'parc8', name: 'Place de Verdun', type: 'parc', lat: 45.1869, lng: 0.7207, address: 'Place de Verdun, 24000 Périgueux', disabilities: ['moteur', 'visuel', 'mental'], equipment: ['chemin_plat', 'bancs', 'aire_jeux_adaptee'], score: 5, reviews: [{user:'Claire',rating:5,text:"Aire de jeux accessible, fontaine, très bien pour les familles."}], photos: [], hours: '24h/24', phone: '', quartier: 'Centre', verified: true, description: "Place avec fontaine et aire de jeux de 40 m². Espace ombragé isolé de la circulation." },
  { id: 'parc9', name: 'Esplanade du Souvenir', type: 'parc', lat: 45.1874, lng: 0.7217, address: 'Face à la préfecture, 24000 Périgueux', disabilities: ['moteur', 'visuel'], equipment: ['chemin_plat', 'bancs'], score: 4, reviews: [], photos: [], hours: '24h/24', phone: '', quartier: 'Centre', verified: true, description: "Espace ombragé de repos face à la préfecture, allées planes." },
  { id: 'parc10', name: 'Prairie du Grand Puy Bernard', type: 'parc', lat: 45.1935, lng: 0.7255, address: 'Avenue Pompidou, 24000 Périgueux', disabilities: ['moteur', 'visuel', 'mental'], equipment: ['chemin_plat', 'bancs'], score: 4, reviews: [], photos: [], hours: '24h/24', phone: '', quartier: 'Gour de l\'Arche', verified: true, description: "7 000 m² en gestion naturelle pour favoriser la biodiversité urbaine. Végétation spontanée, inventaire faunistique et floristique régulier." },
  { id: 'parc11', name: 'Jardin du Canal (Laboratoire nature)', type: 'parc', lat: 45.1805, lng: 0.7155, address: 'Abords du canal, 24000 Périgueux', disabilities: ['moteur', 'mental'], equipment: ['chemin_plat', 'bancs'], score: 4, reviews: [{user:'Benoît',rating:4,text:"Concept « jardin en mouvement » super intéressant. Chemins plats."}], photos: [], hours: '24h/24', phone: '', quartier: 'Saint-Georges', verified: true, description: "Laboratoire de nature citadine selon le principe du « jardin en mouvement » de Gilles Clément. 100 espèces végétales, 40 d'insectes, 37 d'oiseaux." },
  { id: 'parc12', name: 'Square de la Clautre', type: 'parc', lat: 45.1848, lng: 0.7228, address: 'Place de la Clautre, 24000 Périgueux', disabilities: ['moteur', 'visuel'], equipment: ['chemin_plat', 'bancs'], score: 4, reviews: [], photos: [], hours: '24h/24', phone: '', quartier: 'Centre historique', verified: true, description: "Petit jardin à l'emplacement du donjon et du réfectoire de l'abbaye, adjacent à la Cathédrale Saint-Front." },
  { id: 'parc13', name: 'Allées de Tourny (Promenade)', type: 'parc', lat: 45.1870, lng: 0.7195, address: 'Allées de Tourny, 24000 Périgueux', disabilities: ['moteur', 'visuel'], equipment: ['chemin_plat', 'bancs', 'eclairage', 'allees_larges'], score: 5, reviews: [{user:'Paul',rating:5,text:"Promenade emblématique de Périgueux, totalement accessible."}], photos: [], hours: '24h/24', phone: '', quartier: 'Centre', verified: true, description: "Grande promenade plantée d'arbres au cœur de la ville, emblématique depuis le XVIIIe siècle." },

  // === BALADES ACCESSIBLES ===
  { id: 'bal1', name: 'Bords de l\'Isle — Rive gauche', type: 'balade', lat: 45.1825, lng: 0.7175, address: 'Quai de l\'Isle, 24000 Périgueux', disabilities: ['moteur', 'visuel', 'mental'], equipment: ['chemin_plat', 'bancs', 'eclairage', 'parking_pmr'], score: 5, reviews: [{user:'Antoine',rating:5,text:"Balade au fil de l'eau, 2km accessibles en fauteuil."}], photos: [], hours: '24h/24', phone: '', quartier: 'Saint-Georges', verified: true, description: "Promenade le long de l'Isle, 2km de chemin plat et large, vue sur la cathédrale." },
  { id: 'bal2', name: 'Voie verte Périgueux-Trélissac', type: 'balade', lat: 45.1925, lng: 0.7345, address: 'Départ Place Francheville, 24000 Périgueux', disabilities: ['moteur', 'visuel', 'mental'], equipment: ['chemin_plat', 'eclairage', 'allees_larges'], score: 5, reviews: [], photos: [], hours: '24h/24', phone: '', quartier: 'Nord-Est', verified: true, description: "Ancienne voie ferrée reconvertie, revêtement stabilisé, totalement plate, idéale pour fauteuil et PMR." },

  // === CULTURE ===
  { id: 'cult1', name: 'Cathédrale Saint-Front', type: 'culture', lat: 45.1846, lng: 0.7229, address: 'Place de la Clautre, 24000 Périgueux', disabilities: ['moteur', 'visuel'], equipment: ['rampe', 'toilettes_pmr'], score: 4, reviews: [{user:'Marie',rating:4,text:"Accès principal par rampe, intérieur spacieux."}], photos: [], hours: '8h-19h', phone: '05 53 53 23 20', quartier: 'Centre historique', verified: true },
  { id: 'cult2', name: 'Musée Vesunna', type: 'culture', lat: 45.1819, lng: 0.7168, address: "20 Rue du 26e Régiment d'Infanterie, 24000 Périgueux", disabilities: ['moteur', 'visuel', 'auditif', 'mental'], equipment: ['ascenseur', 'rampe', 'toilettes_pmr', 'parking_pmr', 'boucle_magnetique', 'braille'], score: 5, reviews: [{user:'Sophie',rating:5,text:"Exemplaire ! Tous niveaux accessibles, audioguides adaptés."}], photos: [], hours: '10h-18h', phone: '05 53 53 00 92', quartier: 'Saint-Georges', verified: true },
  { id: 'cult3', name: 'Médiathèque Pierre Fanlac', type: 'culture', lat: 45.1895, lng: 0.7205, address: '12 Avenue Georges Pompidou, 24000 Périgueux', disabilities: ['moteur', 'visuel', 'auditif', 'mental'], equipment: ['ascenseur', 'toilettes_pmr', 'parking_pmr', 'boucle_magnetique'], score: 5, reviews: [{user:'Claire',rating:5,text:"Personnel formé, postes adaptés disponibles."}], photos: [], hours: '10h-18h30', phone: '05 53 45 65 45', quartier: 'Centre', verified: true },
  { id: 'cult4', name: "Théâtre de Périgueux (L'Odyssée)", type: 'culture', lat: 45.1882, lng: 0.7232, address: 'Esplanade Robert Badinter, 24000 Périgueux', disabilities: ['moteur', 'auditif'], equipment: ['ascenseur', 'toilettes_pmr', 'parking_pmr', 'boucle_magnetique', 'places_pmr_salle'], score: 5, reviews: [{user:'Isabelle',rating:5,text:"Salles parfaitement adaptées."}], photos: [], hours: 'Selon programmation', phone: '05 53 53 18 71', quartier: 'Centre', verified: true },
  { id: 'cult5', name: "Musée d'Art et d'Archéologie du Périgord (MAAP)", type: 'culture', lat: 45.1867, lng: 0.7241, address: '22 Cours Tourny, 24000 Périgueux', disabilities: ['moteur', 'visuel', 'auditif', 'mental'], equipment: ['ascenseur', 'toilettes_pmr', 'audioguide_adapte'], score: 4, reviews: [], photos: [], hours: '10h30-17h30', phone: '05 53 06 40 70', quartier: 'Centre', verified: true },

  // === RESTAURANTS ACCESSIBLES PMR ===
  // Source officielle : Office de Tourisme du Grand Périgueux (liste des structures accessibles)
  { id: 'res1', name: "Restaurant L'Essentiel", type: 'restaurant', lat: 45.1833, lng: 0.7218, address: '8 Rue de la Clarté, 24000 Périgueux', disabilities: ['moteur'], equipment: ['rampe', 'toilettes_pmr'], score: 4, reviews: [{user:'Julien',rating:4,text:"Entrée de plain-pied, tables espacées."}], photos: [], hours: '12h-14h / 19h-22h', phone: '05 53 35 15 15', quartier: 'Centre historique', verified: true },
  { id: 'res2', name: 'Café Saint-Louis', type: 'restaurant', lat: 45.1852, lng: 0.7225, address: 'Place Saint-Louis, 24000 Périgueux', disabilities: ['moteur'], equipment: ['terrasse_accessible'], score: 3, reviews: [{user:'Léa',rating:3,text:"Terrasse accessible mais toilettes à l'étage."}], photos: [], hours: '8h-minuit', phone: '', quartier: 'Centre historique', verified: true },
  { id: 'res3', name: 'Restaurant Le Clos Saint-Front', type: 'restaurant', lat: 45.1843, lng: 0.7227, address: '5 Rue de la Sagesse, 24000 Périgueux', disabilities: ['moteur'], equipment: ['rampe', 'toilettes_pmr', 'tables_adaptees'], score: 5, reviews: [{user:'Marc',rating:5,text:"Excellente cuisine, accueil attentionné."}], photos: [], hours: '12h-14h / 19h30-22h', phone: '05 53 46 78 58', quartier: 'Centre historique', verified: true },
  { id: 'res4', name: 'Brasserie Le Zinc', type: 'restaurant', lat: 45.1856, lng: 0.7214, address: '12 Cours Montaigne, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'tables_adaptees'], score: 3, reviews: [{user:'Fanny',rating:3,text:"Entrée accessible, toilettes un peu étroites."}], photos: [], hours: '7h-23h', phone: '', quartier: 'Centre', verified: true },
  { id: 'res5', name: 'Hercule Poireau', type: 'restaurant', lat: 45.1847, lng: 0.7226, address: '2 Rue Nation, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'toilettes_pmr'], score: 4, reviews: [{user:'Nathalie',rating:4,text:"Cadre magnifique sous voûte de pierre, accès plain-pied."}], photos: [], hours: '12h-14h / 19h-22h', phone: '05 53 08 90 76', quartier: 'Centre historique', verified: true, description: "Restaurant sous voûtes de pierre, cuisine du terroir périgourdin." },
  { id: 'res6', name: 'Le Rocher de l\'Arsault', type: 'restaurant', lat: 45.1862, lng: 0.7242, address: '15 Rue de l\'Arsault, 24000 Périgueux', disabilities: ['moteur'], equipment: ['rampe', 'toilettes_pmr'], score: 4, reviews: [], photos: [], hours: '12h-14h / 19h-22h', phone: '05 53 53 54 06', quartier: 'Centre', verified: true },
  { id: 'res7', name: "L'Epicurien", type: 'restaurant', lat: 45.1841, lng: 0.7220, address: '1 Rue du Conseil, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'tables_adaptees'], score: 4, reviews: [], photos: [], hours: '12h-14h / 19h-22h', phone: '', quartier: 'Centre historique', verified: true },
  { id: 'res8', name: 'Au Bien Bon Tome II', type: 'restaurant', lat: 45.1850, lng: 0.7230, address: '15 Rue Aubergerie, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 3, reviews: [], photos: [], hours: '12h-14h / 19h30-22h', phone: '05 53 09 69 91', quartier: 'Centre historique', verified: true },
  { id: 'res9', name: 'Lou Chabrol', type: 'restaurant', lat: 45.1858, lng: 0.7219, address: '6 Rue de la Sagesse, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'toilettes_pmr'], score: 4, reviews: [], photos: [], hours: '12h-14h / 19h-22h', phone: '', quartier: 'Centre historique', verified: true },
  { id: 'res10', name: 'Le Saint-Jacques', type: 'restaurant', lat: 45.1863, lng: 0.7209, address: '8 Rue Saint-Jacques, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 3, reviews: [], photos: [], hours: '12h-14h / 19h-22h', phone: '', quartier: 'Centre', verified: true },
  { id: 'res11', name: 'Cannelle et Romarin', type: 'restaurant', lat: 45.1846, lng: 0.7216, address: '1 Rue Notre Dame, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'toilettes_pmr', 'tables_adaptees'], score: 5, reviews: [{user:'Stéphanie',rating:5,text:"Accueil exemplaire, personnel attentif aux besoins."}], photos: [], hours: '12h-14h', phone: '05 53 53 28 69', quartier: 'Centre historique', verified: true },
  { id: 'res12', name: "L'Eden", type: 'restaurant', lat: 45.1854, lng: 0.7210, address: '9 Rue de la Nation, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 3, reviews: [], photos: [], hours: '12h-14h / 19h-22h', phone: '', quartier: 'Centre', verified: true },
  { id: 'res13', name: 'La Taula', type: 'restaurant', lat: 45.1850, lng: 0.7237, address: '3 Rue Denfert Rochereau, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'tables_adaptees'], score: 4, reviews: [], photos: [], hours: '12h-14h / 19h-22h', phone: '05 53 35 40 02', quartier: 'Centre', verified: true },
  { id: 'res14', name: 'Le Bouche à Oreille', type: 'restaurant', lat: 45.1845, lng: 0.7233, address: '10 Rue Saint-Silain, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'toilettes_pmr'], score: 4, reviews: [], photos: [], hours: '12h-14h / 19h-22h', phone: '', quartier: 'Centre historique', verified: true },
  { id: 'res15', name: 'Café Louise', type: 'restaurant', lat: 45.1856, lng: 0.7222, address: '12 Rue Limogeanne, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 3, reviews: [], photos: [], hours: '8h-19h', phone: '', quartier: 'Centre historique', verified: true },
  { id: 'res16', name: "L'Esplanade", type: 'restaurant', lat: 45.1874, lng: 0.7222, address: "Place de l'Hôtel de Ville, 24000 Périgueux", disabilities: ['moteur'], equipment: ['plain_pied', 'toilettes_pmr', 'parking_pmr'], score: 5, reviews: [{user:'Céline',rating:5,text:"Sur la place de l'hôtel de ville, très accessible, terrasse parfaite."}], photos: [], hours: '8h-23h', phone: '05 53 09 40 65', quartier: 'Centre', verified: true },
  { id: 'res17', name: 'Le QG', type: 'restaurant', lat: 45.1849, lng: 0.7226, address: '7 Rue Notre Dame, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 3, reviews: [], photos: [], hours: '12h-14h / 19h-22h', phone: '', quartier: 'Centre historique', verified: true },
  { id: 'res18', name: 'Le Rétro', type: 'restaurant', lat: 45.1852, lng: 0.7218, address: '18 Rue Aubergerie, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'toilettes_pmr'], score: 4, reviews: [], photos: [], hours: '12h-14h / 19h-22h', phone: '', quartier: 'Centre historique', verified: true },
  { id: 'res19', name: 'Rosa Dei Venti', type: 'restaurant', lat: 45.1859, lng: 0.7231, address: '9 Cours Fénelon, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'tables_adaptees'], score: 4, reviews: [], photos: [], hours: '12h-14h / 19h-22h30', phone: '', quartier: 'Centre', verified: true, description: "Restaurant italien, accès plain-pied." },
  { id: 'res20', name: 'Garden Ice Café', type: 'restaurant', lat: 45.1877, lng: 0.7219, address: 'Place Francheville, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'terrasse_accessible'], score: 4, reviews: [], photos: [], hours: '9h-minuit', phone: '05 53 04 32 70', quartier: 'Centre', verified: true },
  { id: 'res21', name: 'Chez Fred', type: 'restaurant', lat: 45.1848, lng: 0.7234, address: '1 Place de la Vertu, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'toilettes_pmr'], score: 4, reviews: [], photos: [], hours: '12h-14h / 19h-22h', phone: '', quartier: 'Centre historique', verified: true },
  { id: 'res22', name: 'Buffet de la Gare', type: 'restaurant', lat: 45.1927, lng: 0.7188, address: 'Rue Denis Papin (Gare SNCF), 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'toilettes_pmr', 'parking_pmr'], score: 4, reviews: [], photos: [], hours: '7h-21h', phone: '', quartier: 'Gare', verified: true },
  { id: 'res23', name: "Little Cocotte", type: 'restaurant', lat: 45.1843, lng: 0.7218, address: '16 Rue Eguillerie, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 3, reviews: [], photos: [], hours: '12h-14h / 19h-22h', phone: '', quartier: 'Centre historique', verified: true },
  { id: 'res24', name: "L'Espace du 6e Sens", type: 'restaurant', lat: 45.1855, lng: 0.7225, address: '16 Rue Salinière, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'tables_adaptees'], score: 4, reviews: [], photos: [], hours: '12h-14h / 19h-22h', phone: '', quartier: 'Centre historique', verified: true },
  { id: 'res25', name: 'La Péniche', type: 'restaurant', lat: 45.1824, lng: 0.7182, address: "Quai de l'Isle, 24000 Périgueux", disabilities: ['moteur'], equipment: ['plain_pied', 'parking_pmr'], score: 4, reviews: [{user:'Marc',rating:4,text:"Restaurant sur péniche, place PMR réservée à proximité."}], photos: [], hours: '12h-14h / 19h30-22h', phone: '', quartier: 'Saint-Georges', verified: true, description: "Restaurant sur péniche au bord de l'Isle, place de parking PMR réservée par l'établissement." },
  { id: 'res26', name: 'Le Seizième', type: 'restaurant', lat: 45.1861, lng: 0.7225, address: '16 Rue Wilson, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 3, reviews: [], photos: [], hours: '12h-14h / 19h-22h', phone: '', quartier: 'Centre', verified: true },
  { id: 'res27', name: 'Café de la Place', type: 'restaurant', lat: 45.1850, lng: 0.7222, address: '7 Place du Marché au Bois, 24000 Périgueux', disabilities: ['moteur'], equipment: ['terrasse_accessible'], score: 3, reviews: [], photos: [], hours: '7h-23h', phone: '', quartier: 'Centre historique', verified: true },

  // === HÔTELS-RESTAURANTS ACCESSIBLES (Grand Périgueux) ===
  { id: 'res28', name: 'Ibis Périgueux Centre', type: 'restaurant', lat: 45.1879, lng: 0.7188, address: 'Rue Denis Papin, 24000 Périgueux', disabilities: ['moteur', 'visuel'], equipment: ['plain_pied', 'ascenseur', 'toilettes_pmr', 'parking_pmr', 'tables_adaptees'], score: 5, reviews: [], photos: [], hours: '6h30-22h', phone: '05 53 53 64 58', quartier: 'Gare', verified: true, description: "Hôtel-restaurant accessible, chambres PMR, restaurant adapté." },

  // === COMMERCES ===
  { id: 'com1', name: 'Galeries Lafayette Périgueux', type: 'commerce', lat: 45.1847, lng: 0.7210, address: '9 Rue Taillefer, 24000 Périgueux', disabilities: ['moteur'], equipment: ['ascenseur', 'toilettes_pmr'], score: 4, reviews: [], photos: [], hours: '9h30-19h', phone: '05 53 08 77 77', quartier: 'Centre', verified: true },
  { id: 'com2', name: 'Marché couvert Place du Coderc', type: 'commerce', lat: 45.1851, lng: 0.7221, address: 'Place du Coderc, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'allees_larges'], score: 4, reviews: [], photos: [], hours: 'Mercredi/Samedi 8h-13h', phone: '', quartier: 'Centre historique', verified: true },
  { id: 'com3', name: 'Intermarché Périgueux', type: 'commerce', lat: 45.1921, lng: 0.7289, address: 'Route de Limoges, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'parking_pmr', 'toilettes_pmr', 'caddies_adaptes'], score: 4, reviews: [], photos: [], hours: '8h30-20h', phone: '', quartier: 'Nord', verified: true },
  { id: 'com4', name: 'Leclerc Périgueux Trélissac', type: 'commerce', lat: 45.1985, lng: 0.7682, address: 'Avenue Michel Grandou, 24750 Trélissac', disabilities: ['moteur'], equipment: ['plain_pied', 'parking_pmr', 'toilettes_pmr', 'caddies_adaptes', 'ascenseur'], score: 5, reviews: [], photos: [], hours: '8h30-20h30', phone: '', quartier: 'Trélissac', verified: true },
  { id: 'com5', name: 'Monoprix Périgueux', type: 'commerce', lat: 45.1855, lng: 0.7213, address: '5 Cours Montaigne, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'ascenseur'], score: 4, reviews: [], photos: [], hours: '8h30-20h', phone: '', quartier: 'Centre', verified: true },
  { id: 'com6', name: 'FNAC Périgueux', type: 'commerce', lat: 45.1864, lng: 0.7231, address: '7 Rue de la Miséricorde, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'ascenseur'], score: 4, reviews: [], photos: [], hours: '10h-19h', phone: '', quartier: 'Centre', verified: true },
  { id: 'com7', name: 'Pharmacie Centrale', type: 'commerce', lat: 45.1853, lng: 0.7214, address: '4 Place Bugeaud, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 4, reviews: [], photos: [], hours: '9h-19h30', phone: '', quartier: 'Centre', verified: true },

  // === TOILETTES PMR PUBLIQUES ===
  { id: 'wc1', name: 'Toilettes publiques Place Bugeaud', type: 'toilettes', lat: 45.1849, lng: 0.7216, address: 'Place Bugeaud, 24000 Périgueux', disabilities: ['moteur'], equipment: ['toilettes_pmr'], score: 4, reviews: [], photos: [], hours: '8h-20h', phone: '', quartier: 'Centre', verified: true },
  { id: 'wc2', name: 'Toilettes publiques Place Francheville', type: 'toilettes', lat: 45.1838, lng: 0.7199, address: 'Place Francheville, 24000 Périgueux', disabilities: ['moteur'], equipment: ['toilettes_pmr'], score: 4, reviews: [], photos: [], hours: '7h-21h', phone: '', quartier: 'Centre', verified: true },
  { id: 'wc3', name: 'Toilettes Jardin des Arènes', type: 'toilettes', lat: 45.1857, lng: 0.7187, address: 'Jardin des Arènes, 24000 Périgueux', disabilities: ['moteur'], equipment: ['toilettes_pmr'], score: 4, reviews: [], photos: [], hours: '7h-19h', phone: '', quartier: 'Centre', verified: true },
  { id: 'wc4', name: 'Toilettes Place Montaigne', type: 'toilettes', lat: 45.1842, lng: 0.7213, address: 'Place Montaigne, 24000 Périgueux', disabilities: ['moteur'], equipment: ['toilettes_pmr'], score: 3, reviews: [], photos: [], hours: '8h-19h', phone: '', quartier: 'Centre', verified: true },
  { id: 'wc5', name: 'Toilettes Gare SNCF Périgueux', type: 'toilettes', lat: 45.1928, lng: 0.7187, address: 'Rue Denis Papin, 24000 Périgueux', disabilities: ['moteur'], equipment: ['toilettes_pmr'], score: 4, reviews: [], photos: [], hours: '5h-23h', phone: '', quartier: 'Gare', verified: true },

  // === PARKINGS PMR ===
  { id: 'park1', name: 'Parking Montaigne PMR', type: 'parking', lat: 45.1841, lng: 0.7212, address: 'Place Montaigne, 24000 Périgueux', disabilities: ['moteur'], equipment: ['parking_pmr', 'places_larges'], score: 4, reviews: [], photos: [], hours: '24h/24', phone: '', quartier: 'Centre', verified: true },
  { id: 'park2', name: 'Parking Francheville PMR', type: 'parking', lat: 45.1836, lng: 0.7196, address: 'Place Francheville, 24000 Périgueux', disabilities: ['moteur'], equipment: ['parking_pmr', 'places_larges'], score: 5, reviews: [], photos: [], hours: '24h/24', phone: '', quartier: 'Centre', verified: true },
  { id: 'park3', name: 'Parking Hôtel de Ville PMR', type: 'parking', lat: 45.1872, lng: 0.7222, address: "Place de l'Hôtel de Ville, 24000 Périgueux", disabilities: ['moteur'], equipment: ['parking_pmr', 'places_larges'], score: 5, reviews: [], photos: [], hours: '24h/24', phone: '', quartier: 'Centre', verified: true },
  { id: 'park4', name: 'Parking Bugeaud PMR', type: 'parking', lat: 45.1849, lng: 0.7213, address: 'Place Bugeaud, 24000 Périgueux', disabilities: ['moteur'], equipment: ['parking_pmr', 'places_larges'], score: 4, reviews: [], photos: [], hours: '24h/24', phone: '', quartier: 'Centre', verified: true },
  { id: 'park5', name: 'Parking Gare SNCF PMR', type: 'parking', lat: 45.1923, lng: 0.7192, address: 'Rue Denis Papin, 24000 Périgueux', disabilities: ['moteur'], equipment: ['parking_pmr', 'places_larges'], score: 5, reviews: [], photos: [], hours: '24h/24', phone: '', quartier: 'Gare', verified: true },
  { id: 'park6', name: 'Parking Tourny PMR', type: 'parking', lat: 45.1868, lng: 0.7201, address: 'Allées de Tourny, 24000 Périgueux', disabilities: ['moteur'], equipment: ['parking_pmr', 'places_larges'], score: 4, reviews: [], photos: [], hours: '24h/24', phone: '', quartier: 'Centre', verified: true },
  { id: 'park7', name: 'Parking Mairie PMR', type: 'parking', lat: 45.1874, lng: 0.7218, address: 'Rue Wilson, 24000 Périgueux', disabilities: ['moteur'], equipment: ['parking_pmr', 'places_larges'], score: 5, reviews: [], photos: [], hours: '24h/24', phone: '', quartier: 'Centre', verified: true },

  // ============================================================
  // 🩸 SECTION DIABÈTE — Où trouver du sucre rapide en urgence
  // ============================================================
  // Hypoglycémie = besoin de 15g de sucre rapide IMMÉDIAT.
  // Cette section recense les lieux ouverts tard / dimanche /
  // 24h/24 à Périgueux où l'on peut trouver : sucre, jus, soda,
  // bonbons, miel, fruits, pâte de fruits, biscuits.
  // Sources : Pages Jaunes, Office de Tourisme, commerçants locaux

  // --- 🏥 PHARMACIES (priorité médicale, conseils adaptés) ---
  { id: 'sug1', name: '💊 Pharmacie des Quatre Chemins (24h/24)', type: 'sucre', lat: 45.1868, lng: 0.7175, address: '2 Rue Mobiles de Coulmiers, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'toilettes_pmr'], score: 5, reviews: [{user:'Équipe',rating:5,text:"SEULE pharmacie ouverte 24h/24 et 7j/7 à Périgueux. Matériel médical, conseils diabète, glucose en gel disponible."}], photos: [], hours: '24h/24 - 7j/7', phone: '05 53 53 38 31', quartier: 'Centre', verified: true, description: "⚠️ PHARMACIE 24h/24 - La plus fiable en cas d'urgence nocturne. Vend du glucose en gel, des comprimés de glucose (Dextro Energy), et peut conseiller." },
  { id: 'sug2', name: '💊 Pharmacie Pharmavance Centre', type: 'sucre', lat: 45.1851, lng: 0.7220, address: '2 Place du Coderc, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 4, reviews: [], photos: [], hours: '8h30-19h30 (fermée dimanche)', phone: '05 53 53 45 69', quartier: 'Centre historique', verified: true, description: "Pharmacie centrale, vend comprimés de glucose et matériel pour diabétiques." },
  { id: 'sug3', name: '💊 Pharmacie Victor Hugo', type: 'sucre', lat: 45.1867, lng: 0.7186, address: '104 Rue Victor Hugo, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 4, reviews: [], photos: [], hours: '8h30-19h30', phone: '', quartier: 'Centre', verified: true, description: "Pharmacie de quartier, affiche la pharmacie de garde en vitrine." },
  { id: 'sug4', name: '💊 Pharmacie Gaëlle Campagne', type: 'sucre', lat: 45.1867, lng: 0.7201, address: '36 Rue Gambetta, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 4, reviews: [], photos: [], hours: '8h30-19h30', phone: '', quartier: 'Centre', verified: true },

  // --- 🥐 BOULANGERIES OUVERTES TÔT/TARD/DIMANCHE ---
  { id: 'sug5', name: '🥐 Firmin Périgueux (6h-20h30, 7j/7)', type: 'sucre', lat: 45.1849, lng: 0.7217, address: '2 Rue Taillefer, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'terrasse_accessible'], score: 5, reviews: [{user:'Info',rating:5,text:"Ouvert TOUS LES JOURS dimanche compris, de 6h à 20h30. Viennoiseries, sandwichs sucrés, bonbons."}], photos: [], hours: '6h-20h30 - 7j/7', phone: '05 53 09 55 28', quartier: 'Centre', verified: true, description: "✅ Ouvert dimanche ET jours fériés. Viennoiseries, pâtisseries, jus de fruits." },
  { id: 'sug6', name: '🥐 Au Fournil de la Cité', type: 'sucre', lat: 45.1846, lng: 0.7234, address: '11 Place de la Cité, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 4, reviews: [{user:'Info',rating:4,text:"Ouvert dimanche 7h-13h30. Viennoiseries, pâtisseries et sandwichs."}], photos: [], hours: 'Lun-Sam 7h-19h30 / Dim 7h-13h30', phone: '', quartier: 'Centre historique', verified: true, description: "Boulangerie artisanale ouverte le dimanche matin." },
  { id: 'sug7', name: '🥐 Marie Blachère Périgueux', type: 'sucre', lat: 45.1950, lng: 0.7310, address: 'Route de Limoges, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'parking_pmr'], score: 4, reviews: [], photos: [], hours: '6h-20h - 7j/7', phone: '', quartier: 'Nord', verified: true, description: "Chaîne de boulangerie ouverte 7j/7 tôt le matin." },
  { id: 'sug8', name: '🥐 Pichard Alain Boulangerie', type: 'sucre', lat: 45.1858, lng: 0.7199, address: '13 Bd Montaigne, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 4, reviews: [], photos: [], hours: '7h-20h30', phone: '05 53 53 52 30', quartier: 'Centre', verified: true },

  // --- 🛒 SUPÉRETTES / SUPERMARCHÉS (ouverts tard) ---
  { id: 'sug9', name: '🛒 Carrefour City Centre', type: 'sucre', lat: 45.1858, lng: 0.7215, address: '8 Cours Montaigne, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 5, reviews: [{user:'Info',rating:5,text:"Ouvert jusqu'à 22h, dimanche matin. Jus, sodas, bonbons, sucre en poudre."}], photos: [], hours: '7h-22h / Dim 8h-13h', phone: '', quartier: 'Centre', verified: true, description: "✅ Supérette de proximité au centre, ouverte tard et dimanche matin." },
  { id: 'sug10', name: '🛒 Carrefour Express Gare', type: 'sucre', lat: 45.1925, lng: 0.7190, address: 'Rue Denis Papin, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'parking_pmr'], score: 4, reviews: [], photos: [], hours: '6h-22h - 7j/7', phone: '', quartier: 'Gare', verified: true, description: "Ouvert dimanche, pratique pour les voyageurs." },
  { id: 'sug11', name: '🛒 Monoprix Périgueux', type: 'sucre', lat: 45.1855, lng: 0.7213, address: '5 Cours Montaigne, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'ascenseur'], score: 4, reviews: [], photos: [], hours: '8h30-20h / Dim 9h-13h', phone: '', quartier: 'Centre', verified: true, description: "Rayon confiserie et boissons, ouvert le dimanche matin." },
  { id: 'sug12', name: '🛒 Netto Périgueux', type: 'sucre', lat: 45.1936, lng: 0.7145, address: '156 Avenue du Maréchal Juin, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'parking_pmr', 'caddies_adaptes'], score: 4, reviews: [], photos: [], hours: '8h30-19h30', phone: '05 53 46 75 46', quartier: 'Ouest', verified: true },
  { id: 'sug13', name: '🛒 Intermarché Périgueux (diabète)', type: 'sucre', lat: 45.1921, lng: 0.7289, address: 'Route de Limoges, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'parking_pmr', 'toilettes_pmr', 'caddies_adaptes'], score: 4, reviews: [], photos: [], hours: '8h30-20h / Dim 8h30-12h30', phone: '', quartier: 'Nord', verified: true, description: "Grand rayon confiserie, jus, produits diététiques." },

  // --- 🚬 TABACS-PRESSE (confiseries, sodas, souvent ouverts tard) ---
  { id: 'sug14', name: '🚬 Le Longchamp (Tabac-Presse)', type: 'sucre', lat: 45.1852, lng: 0.7227, address: 'Place Saint-Louis, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 4, reviews: [{user:'Info',rating:4,text:"Confiseries, bonbons, boissons sucrées. Ouvert tôt le matin et le dimanche."}], photos: [], hours: '6h30-20h / Dim 7h-13h', phone: '', quartier: 'Centre historique', verified: true, description: "Tabac-presse avec large choix de confiseries et boissons." },
  { id: 'sug15', name: '🚬 Tabac de la Gare', type: 'sucre', lat: 45.1929, lng: 0.7188, address: 'Place Bertran de Born (Gare), 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 4, reviews: [], photos: [], hours: '6h-22h - 7j/7', phone: '', quartier: 'Gare', verified: true, description: "Ouvert 7j/7, pratique pour jus et confiseries près de la gare." },

  // --- ⛽ STATIONS-SERVICE (boutiques 24h/24 ou tard) ---
  { id: 'sug16', name: '⛽ Total Périgueux Cours Fénelon', type: 'sucre', lat: 45.1855, lng: 0.7240, address: 'Cours Fénelon, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'parking_pmr'], score: 4, reviews: [{user:'Info',rating:4,text:"Boutique ouverte tard, jus, sodas, confiseries disponibles en libre-service."}], photos: [], hours: '6h-22h - 7j/7', phone: '', quartier: 'Centre', verified: true, description: "Station-service avec boutique : sodas, jus, bonbons, sandwichs." },
  { id: 'sug17', name: '⛽ Intermarché Station (automate 24h/24)', type: 'sucre', lat: 45.1921, lng: 0.7289, address: 'Route de Limoges, 24000 Périgueux', disabilities: ['moteur'], equipment: ['parking_pmr'], score: 3, reviews: [{user:'Info',rating:3,text:"Distributeur automatique avec snacks sucrés accessible 24h/24 en façade."}], photos: [], hours: '24h/24 (distributeur)', phone: '', quartier: 'Nord', verified: true, description: "🌙 Distributeur automatique de snacks 24h/24 en accès libre devant le magasin." },
  { id: 'sug18', name: "⛽ Avia Périgueux Route d'Angoulême", type: 'sucre', lat: 45.1905, lng: 0.7105, address: "Route d'Angoulême, 24000 Périgueux", disabilities: ['moteur'], equipment: ['plain_pied', 'parking_pmr'], score: 3, reviews: [], photos: [], hours: '6h-22h', phone: '', quartier: 'Ouest', verified: true },

  // --- 👨‍⚕️ DIABÉTOLOGUES / ENDOCRINOLOGUES (Périgueux) ---
  // Source : Centre Hospitalier de Périgueux + Doctoome + Pages Jaunes
  { id: 'diab1', name: '🏥 Service Diabétologie - CH Périgueux', type: 'diabetologue', lat: 45.1935, lng: 0.7215, address: '80 Avenue Georges Pompidou, 24000 Périgueux', disabilities: ['moteur', 'visuel', 'auditif', 'mental'], equipment: ['ascenseur', 'rampe', 'toilettes_pmr', 'parking_pmr', 'boucle_magnetique', 'plain_pied'], score: 5, reviews: [{user:'Info',rating:5,text:"Service hospitalier complet : diabétologie, endocrinologie, maladies métaboliques. Hospitalisation + consultations."}], photos: [], hours: 'Lun-Ven 8h-17h', phone: '05 53 45 25 25', quartier: 'Nord', verified: true, description: "🏥 Service hospitalier spécialisé. Responsable : Dr Christine COFFIN-BOUTREUX. Dr Althel Pharel OPOKO, Dr Marie-Laure RODES, Dr Christelle GUEMAS. Consultation d'urgence sur appel du médecin traitant." },
  { id: 'diab2', name: '👨‍⚕️ Dr Christine COFFIN-BOUTREUX', type: 'diabetologue', lat: 45.1935, lng: 0.7215, address: '80 Avenue Georges Pompidou, 24000 Périgueux', disabilities: ['moteur'], equipment: ['ascenseur', 'toilettes_pmr', 'parking_pmr'], score: 5, reviews: [], photos: [], hours: 'Sur RDV', phone: '05 53 45 25 25', quartier: 'Nord', verified: true, description: "Endocrinologue-diabétologue. Responsable du service de diabétologie du CH Périgueux. RDV via Doctoome ou secrétariat hospitalier." },
  { id: 'diab3', name: '👩‍⚕️ Dr Christelle GUEMAS', type: 'diabetologue', lat: 45.1935, lng: 0.7215, address: '80 Avenue Georges Pompidou, 24000 Périgueux', disabilities: ['moteur'], equipment: ['ascenseur', 'toilettes_pmr', 'parking_pmr'], score: 5, reviews: [], photos: [], hours: 'Sur RDV', phone: '05 53 45 25 25', quartier: 'Nord', verified: true, description: "Endocrinologue-diabétologue au CH Périgueux. RPPS : 10100351773. RDV via Doctolib ou Doctoome." },
  { id: 'diab4', name: '👨‍⚕️ Dr Althel Pharel OPOKO', type: 'diabetologue', lat: 45.1935, lng: 0.7215, address: '80 Avenue Georges Pompidou, 24000 Périgueux', disabilities: ['moteur'], equipment: ['ascenseur', 'toilettes_pmr', 'parking_pmr'], score: 4, reviews: [], photos: [], hours: 'Sur RDV', phone: '05 53 45 25 25', quartier: 'Nord', verified: true, description: "Médecin du service diabétologie CH Périgueux." },
  { id: 'diab5', name: '👩‍⚕️ Dr Marie-Laure RODES', type: 'diabetologue', lat: 45.1935, lng: 0.7215, address: '80 Avenue Georges Pompidou, 24000 Périgueux', disabilities: ['moteur'], equipment: ['ascenseur', 'toilettes_pmr', 'parking_pmr'], score: 4, reviews: [], photos: [], hours: 'Sur RDV', phone: '05 53 45 25 25', quartier: 'Nord', verified: true, description: "Médecin du service diabétologie CH Périgueux." },

  // --- 🔬 LABORATOIRES D'ANALYSES (glycémie, HbA1c) ---
  { id: 'lab1', name: '🔬 Laboratoire Bio24 Centre', type: 'laboratoire', lat: 45.1855, lng: 0.7219, address: '6 Place Bugeaud, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'toilettes_pmr'], score: 5, reviews: [{user:'Info',rating:5,text:"Sans RDV pour glycémie à jeun et HbA1c. Prélèvement rapide."}], photos: [], hours: 'Lun-Ven 7h-18h / Sam 7h-12h', phone: '05 53 53 45 12', quartier: 'Centre', verified: true, description: "🩸 Bilan diabète complet : glycémie à jeun, HbA1c, micro-albuminurie. Résultats dans la journée." },
  { id: 'lab2', name: '🔬 Laboratoire Biogroup Tourny', type: 'laboratoire', lat: 45.1868, lng: 0.7212, address: '15 Cours Tourny, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'ascenseur', 'toilettes_pmr'], score: 4, reviews: [], photos: [], hours: 'Lun-Ven 7h-18h30 / Sam 7h30-12h', phone: '05 53 08 70 30', quartier: 'Centre', verified: true, description: "Prélèvements sanguins sans rendez-vous. Spécialisé en bilans diabète." },
  { id: 'lab3', name: '🔬 Laboratoire Cerballiance Périgueux', type: 'laboratoire', lat: 45.1920, lng: 0.7195, address: '43 Rue Wilson, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied', 'parking_pmr'], score: 4, reviews: [], photos: [], hours: 'Lun-Ven 7h-18h / Sam 7h-12h30', phone: '05 53 53 36 68', quartier: 'Nord', verified: true, description: "Laboratoire d'analyses médicales, prises de sang sans RDV." },
  { id: 'lab4', name: '🔬 Laboratoire Synlab Périgueux', type: 'laboratoire', lat: 45.1842, lng: 0.7190, address: '12 Rue Montaigne, 24000 Périgueux', disabilities: ['moteur'], equipment: ['plain_pied'], score: 4, reviews: [], photos: [], hours: 'Lun-Ven 7h-18h / Sam 7h-12h', phone: '', quartier: 'Centre', verified: true, description: "Prélèvements et analyses, suivi diabète." },
  { id: 'lab5', name: '🔬 Laboratoire CH Périgueux', type: 'laboratoire', lat: 45.1935, lng: 0.7215, address: '80 Avenue Georges Pompidou, 24000 Périgueux', disabilities: ['moteur', 'visuel', 'auditif'], equipment: ['ascenseur', 'rampe', 'toilettes_pmr', 'parking_pmr'], score: 5, reviews: [], photos: [], hours: '24h/24 (urgences)', phone: '05 53 45 25 25', quartier: 'Nord', verified: true, description: "🏥 Laboratoire hospitalier accessible 24h/24 via les urgences. Analyses complexes et diabète." },
];

// ======================================================
// CONFIG — Types, badges, niveaux
// ======================================================
const TYPES = {
  restaurant: { label: 'Restaurants', icon: '🍽️', color: '#E07856' },
  parc: { label: 'Parcs & jardins', icon: '🌳', color: '#5A9367' },
  balade: { label: 'Balades', icon: '🚶', color: '#8B7355' },
  culture: { label: 'Culture', icon: '🏛️', color: '#6B5B95' },
  commerce: { label: 'Commerces', icon: '🏪', color: '#D4A574' },
  toilettes: { label: 'Toilettes PMR', icon: '🚻', color: '#4A6FA5' },
  parking: { label: 'Parkings PMR', icon: '🅿️', color: '#3D4A5C' },
  sucre: { label: 'Sucre rapide 🩸', icon: '🍬', color: '#E91E63' },
  diabetologue: { label: 'Diabétologues', icon: '👨‍⚕️', color: '#9C27B0' },
  laboratoire: { label: 'Laboratoires', icon: '🔬', color: '#00ACC1' },
};

const DISABILITIES = {
  moteur: { label: 'Moteur', icon: Accessibility },
  visuel: { label: 'Visuel', icon: Eye },
  auditif: { label: 'Auditif', icon: Ear },
  mental: { label: 'Mental/cognitif', icon: Brain },
};

const EQUIPMENT_LABELS = {
  rampe: 'Rampe d\'accès',
  ascenseur: 'Ascenseur',
  toilettes_pmr: 'Toilettes PMR',
  parking_pmr: 'Parking PMR',
  boucle_magnetique: 'Boucle magnétique',
  braille: 'Signalétique braille',
  chemin_plat: 'Chemin plat',
  bancs: 'Bancs',
  eclairage: 'Éclairage',
  aire_jeux_adaptee: 'Aire de jeux adaptée',
  plain_pied: 'Plain-pied',
  allees_larges: 'Allées larges',
  tables_adaptees: 'Tables adaptées',
  terrasse_accessible: 'Terrasse accessible',
  places_larges: 'Places larges',
  audioguide_adapte: 'Audioguide adapté',
  caddies_adaptes: 'Caddies adaptés',
  places_pmr_salle: 'Places PMR en salle',
};

const LEVELS = [
  { name: 'Novice', min: 0, icon: '🌱', color: '#8B7355' },
  { name: 'Découvreur', min: 50, icon: '🧭', color: '#5A9367' },
  { name: 'Ambassadeur', min: 200, icon: '⭐', color: '#D4A574' },
  { name: 'Expert', min: 500, icon: '🏆', color: '#E07856' },
  { name: 'Légende de Périgueux', min: 1000, icon: '👑', color: '#6B5B95' },
];

const BADGES = [
  { id: 'first_visit', name: 'Premier pas', desc: 'Visiter votre 1er lieu', icon: '🎯', check: (p) => p.checkins.length >= 1 },
  { id: 'gourmet', name: 'Gourmet accessible', desc: 'Visiter 10 restaurants', icon: '🍴', check: (p, places) => p.checkins.filter(id => places.find(pl => pl.id===id)?.type==='restaurant').length >= 10 },
  { id: 'nature', name: 'Nature pour tous', desc: 'Explorer 5 balades ou parcs', icon: '🌿', check: (p, places) => p.checkins.filter(id => ['balade','parc'].includes(places.find(pl => pl.id===id)?.type)).length >= 5 },
  { id: 'culture', name: 'Mécène', desc: 'Découvrir 5 lieux culturels', icon: '🎭', check: (p, places) => p.checkins.filter(id => places.find(pl => pl.id===id)?.type==='culture').length >= 5 },
  { id: 'contributor', name: 'Contributeur', desc: 'Ajouter 3 nouveaux lieux', icon: '✍️', check: (p) => p.contributions >= 3 },
  { id: 'reviewer', name: 'Chroniqueur', desc: 'Laisser 5 avis', icon: '💬', check: (p) => p.reviews >= 5 },
  { id: 'explorer', name: 'Explorateur', desc: 'Visiter 20 lieux différents', icon: '🗺️', check: (p) => new Set(p.checkins).size >= 20 },
  { id: 'legend', name: 'Légende vivante', desc: 'Atteindre 1000 XP', icon: '💎', check: (p) => p.xp >= 1000 },
];

// ======================================================
// HELPERS
// ======================================================
const getLevel = (xp) => {
  let lvl = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.min) lvl = l;
  return lvl;
};
const getNextLevel = (xp) => LEVELS.find(l => l.min > xp);

const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLng = (lng2-lng1) * Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

// Normalise une chaîne pour la recherche (enlève accents, minuscules)
const normalize = (s) => (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// ======================================================
// COMPOSANT PRINCIPAL
// ======================================================
export default function PerigueuxAccess() {
  const [view, setView] = useState('map'); // map | profile | leaderboard | add | place
  const [places, setPlaces] = useState(SEED_PLACES);
  const [profile, setProfile] = useState({ name: 'Explorateur', xp: 0, checkins: [], contributions: 0, reviews: 0, badges: [], favorites: [], glycemies: [] });
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [dark, setDark] = useState(false);
  const [filters, setFilters] = useState({ types: Object.keys(TYPES), disabilities: [], minScore: 0, search: '', sortBy: 'distance', favoritesOnly: false });
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [textSize, setTextSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [sosActive, setSosActive] = useState(false); // Alarme SOS
  const [showOnboarding, setShowOnboarding] = useState(false); // Tuto 1er lancement

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  // Charger données persistantes
  useEffect(() => {
    (async () => {
      // Version des données seed — incrémenter pour forcer un refresh
      const SEED_VERSION = 'v6';
      let currentVersion = null;
      try {
        const v = await window.storage.get('seed_version');
        if (v) currentVersion = v.value;
      } catch(e) {}

      try {
        const prof = await window.storage.get('profile');
        if (prof) {
          const p = JSON.parse(prof.value);
          // Migration : ajouter champs manquants
          if (!p.favorites) p.favorites = [];
          if (!p.glycemies) p.glycemies = [];
          setProfile(p);
        }
      } catch(e) {}

      // Si version obsolète : on fusionne (garde contributions user, remplace seed)
      if (currentVersion !== SEED_VERSION) {
        try {
          const pls = await window.storage.get('places');
          if (pls) {
            const old = JSON.parse(pls.value);
            const userAdded = old.filter(p => p.id.startsWith('u'));
            setPlaces([...SEED_PLACES, ...userAdded]);
          }
        } catch(e) {}
        await window.storage.set('seed_version', SEED_VERSION).catch(()=>{});
      } else {
        try {
          const pls = await window.storage.get('places');
          if (pls) setPlaces(JSON.parse(pls.value));
        } catch(e) {}
      }

      try {
        const lb = await window.storage.get('leaderboard', true);
        if (lb) setLeaderboard(JSON.parse(lb.value));
      } catch(e) {}

      // Onboarding au premier lancement
      try {
        const onb = await window.storage.get('onboarding_seen');
        if (!onb) setShowOnboarding(true);
      } catch(e) { setShowOnboarding(true); }

      setLoading(false);
    })();
  }, []);

  // Sauvegarder profil
  useEffect(() => {
    if (loading) return;
    window.storage.set('profile', JSON.stringify(profile)).catch((err) => {
      if (err && String(err).toLowerCase().includes('quota')) {
        showToast("⚠️ Mémoire pleine — supprimez des glycémies anciennes");
      }
    });
  }, [profile, loading]);

  // Sauvegarder lieux
  useEffect(() => {
    if (loading) return;
    window.storage.set('places', JSON.stringify(places)).catch(()=>{});
  }, [places, loading]);

  // Charger Leaflet au démarrage + invalidateSize quand on revient sur la carte
  useEffect(() => {
    if (loading) return;
    const loadLeaflet = async () => {
      if (!window.L) {
        try {
          await new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
            document.head.appendChild(link);
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Impossible de charger la carte'));
            setTimeout(() => reject(new Error('Chargement trop long')), 15000);
            document.head.appendChild(script);
          });
        } catch (err) {
          showToast("⚠️ Problème de chargement de la carte");
          return;
        }
      }

      if (!mapInstance.current) {
        // Première initialisation
        initMap();
      } else if (view === 'map') {
        // Retour sur la carte — dire à Leaflet de recalculer sa taille
        setTimeout(() => {
          mapInstance.current && mapInstance.current.invalidateSize({ animate: false });
        }, 50);
      }
    };
    loadLeaflet();
  }, [view, loading]);

  const initMap = () => {
    if (!window.L || !mapRef.current || mapInstance.current) return;
    const L = window.L;
    mapInstance.current = L.map(mapRef.current, {
      zoomControl: true,
      dragging: true,        // ✅ Déplacement activé
      tap: true,             // ✅ Tactile iOS activé
      tapTolerance: 15,      // ✅ Plus tolérant au toucher
      touchZoom: true,       // ✅ Zoom avec 2 doigts
      scrollWheelZoom: true, // ✅ Zoom molette desktop
      doubleClickZoom: true, // ✅ Double-tap pour zoomer
    }).setView([45.1846, 0.7229], 15);
    L.tileLayer(dark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      maxZoom: 19,
    }).addTo(mapInstance.current);
    refreshMarkers();
  };

  // Maj tuiles selon thème
  useEffect(() => {
    if (!mapInstance.current || !window.L) return;
    mapInstance.current.eachLayer(l => { if (l instanceof window.L.TileLayer) mapInstance.current.removeLayer(l); });
    window.L.tileLayer(dark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
    }).addTo(mapInstance.current);
  }, [dark]);

  // --- GÉOLOCALISATION (avec fallbacks multiples) ---
  const setLocationAndCenter = (loc, source = 'gps') => {
    setUserLocation(loc);
    setLocationStatus('ok');
    if (mapInstance.current && window.L) {
      const L = window.L;

      // Centrer la carte sur la position avec zoom rapproché
      mapInstance.current.setView([loc.lat, loc.lng], 16, { animate: true, duration: 0.8 });

      // Supprimer ancien marqueur utilisateur
      if (userMarkerRef.current) mapInstance.current.removeLayer(userMarkerRef.current);

      // Marqueur utilisateur avec animation pulsante
      userMarkerRef.current = L.marker([loc.lat, loc.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="
            width: 22px; height: 22px;
            background: #2196F3;
            border: 3px solid #fff;
            border-radius: 50%;
            box-shadow: 0 0 0 6px rgba(33,150,243,0.25);
            animation: userPulse 1.5s ease-in-out infinite;
          "></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        }),
        zIndexOffset: 1000,
      }).addTo(mapInstance.current);

      // Cercle de rayon 300m autour de l'utilisateur
      if (window._userRadiusCircle) {
        mapInstance.current.removeLayer(window._userRadiusCircle);
      }
      window._userRadiusCircle = L.circle([loc.lat, loc.lng], {
        radius: 300,
        color: '#2196F3',
        fillColor: '#2196F3',
        fillOpacity: 0.08,
        weight: 2,
        dashArray: '6, 4',
      }).addTo(mapInstance.current);
    }

    const msg = source === 'gps' ? "📍 Position trouvée — lieux proches affichés !"
              : source === 'ip' ? "📍 Position approximative (par IP)"
              : "📍 Centré sur Périgueux";
    showToast(msg);
  };

  // Fallback 1 : Géolocalisation par IP (marche partout, approximative)
  const tryIpLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error('IP fail');
      const data = await res.json();
      if (data.latitude && data.longitude) {
        setLocationAndCenter({ lat: data.latitude, lng: data.longitude }, 'ip');
        return true;
      }
    } catch (e) {}
    return false;
  };

  // Fallback 2 : Position manuelle (centre-ville de Périgueux par défaut)
  const useManualLocation = (lat = 45.1846, lng = 0.7229) => {
    setLocationAndCenter({ lat, lng }, 'manual');
  };

  const requestLocation = async () => {
    setLocationStatus('loading');

    // Vérifier HTTPS (obligatoire pour géoloc sur Safari iOS)
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    if (!isSecure && !navigator.geolocation) {
      showToast("Géoloc nécessite HTTPS — utilisation de la position IP");
      const ok = await tryIpLocation();
      if (!ok) useManualLocation();
      return;
    }

    // Vérifier si on est dans un environnement qui supporte la géoloc
    if (!navigator.geolocation) {
      showToast("Géoloc non disponible — utilisation de la position IP");
      const ok = await tryIpLocation();
      if (!ok) {
        useManualLocation();
      }
      return;
    }

    // Tentative GPS native
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationAndCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }, 'gps');
      },
      async (err) => {
        // Messages d'erreur explicites
        let reason = '';
        if (err.code === 1) reason = "Vous avez refusé l'accès à la position";
        else if (err.code === 2) reason = "Position indisponible (essayez à l'extérieur)";
        else if (err.code === 3) reason = "La localisation a pris trop de temps";
        else reason = "Erreur de géolocalisation";

        showToast(reason + " — tentative par IP…");

        // Fallback automatique sur géoloc IP
        const ok = await tryIpLocation();
        if (!ok) {
          setLocationStatus('denied');
          showToast("Géoloc impossible. Utilisation du centre de Périgueux.");
          useManualLocation();
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  };

  // Fermer les modales avec la touche Échap
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (sosActive) closeSOS();
        else if (showOnboarding) {
          window.storage.set('onboarding_seen', 'yes').catch(()=>{});
          setShowOnboarding(false);
        }
        else if (showLevelUp) setShowLevelUp(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sosActive, showOnboarding, showLevelUp]);

  // Recentrer la carte sur la position utilisateur
  const recenterMap = () => {
    if (userLocation && mapInstance.current) {
      mapInstance.current.setView([userLocation.lat, userLocation.lng], 15, { animate: true });
      showToast("📍 Recentré sur votre position");
    }
  };

  // --- FAVORIS ---
  const toggleFavorite = (placeId) => {
    const isFav = profile.favorites.includes(placeId);
    const newFavs = isFav
      ? profile.favorites.filter(id => id !== placeId)
      : [...profile.favorites, placeId];
    setProfile({ ...profile, favorites: newFavs });
    showToast(isFav ? "❤️ Retiré des favoris" : "❤️ Ajouté aux favoris");
  };

  // --- PARTAGE ---
  const sharePlace = async (place) => {
    const url = `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}&zoom=18`;
    const text = `📍 ${place.name}\n${place.address}\nScore accessibilité : ${place.score}/5\n${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: place.name, text, url });
      } catch(e) {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
        showToast("📋 Lien copié !");
      } catch(e) { showToast("Impossible de copier"); }
    }
  };

  // --- ITINÉRAIRE ---
  const openDirections = (place) => {
    // Détection iOS vs Android vs desktop
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    let url;
    if (isIOS) {
      url = `maps://maps.apple.com/?daddr=${place.lat},${place.lng}&dirflg=w`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}&travelmode=walking`;
    }
    window.open(url, '_blank');
  };

  // --- 🚨 ALARME SOS HYPOGLYCÉMIE ---
  const triggerSOS = () => {
    setSosActive(true);
    // Vibration si disponible (mobile)
    if (navigator.vibrate) {
      navigator.vibrate([300, 100, 300, 100, 300, 100, 300]);
    }
    // Demande géoloc si pas active
    if (!userLocation) requestLocation();
  };

  const closeSOS = () => {
    setSosActive(false);
    if (navigator.vibrate) navigator.vibrate(0);
  };

  // --- 💉 CARNET DE GLYCÉMIE ---
  const addGlycemie = (value, moment, note) => {
    const entry = {
      id: Date.now(),
      value: parseFloat(value),
      moment, // "jeun" | "avant_repas" | "apres_repas" | "coucher" | "nuit"
      note: note || '',
      date: new Date().toISOString(),
    };
    const newProfile = { ...profile, glycemies: [entry, ...profile.glycemies].slice(0, 200) };
    setProfile(newProfile);
    showToast(`💉 Glycémie enregistrée : ${value} g/L`);
  };

  const deleteGlycemie = (id) => {
    setProfile({ ...profile, glycemies: profile.glycemies.filter(g => g.id !== id) });
  };

  const filteredPlaces = useMemo(() => {
    let list = places.filter(p => {
      if (!filters.types.includes(p.type)) return false;
      if (filters.disabilities.length > 0 && !filters.disabilities.some(d => p.disabilities.includes(d))) return false;
      if (p.score < filters.minScore) return false;
      if (filters.favoritesOnly && !profile.favorites.includes(p.id)) return false;
      if (filters.search) {
        const q = normalize(filters.search);
        if (!normalize(p.name).includes(q) && !normalize(p.address).includes(q) && !normalize(p.quartier).includes(q)) return false;
      }
      return true;
    });

    // Tri
    if (filters.sortBy === 'score') {
      list = [...list].sort((a, b) => b.score - a.score);
    } else if (filters.sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'distance' && userLocation) {
      const dist = (p) => haversine(userLocation.lat, userLocation.lng, p.lat, p.lng);
      list = [...list].sort((a, b) => dist(a) - dist(b));
    }
    return list;
  }, [places, filters, profile.favorites, userLocation]);

  const refreshMarkers = () => {
    if (!mapInstance.current || !window.L) return;
    markersRef.current.forEach(m => mapInstance.current.removeLayer(m));
    markersRef.current = [];
    const L = window.L;
    filteredPlaces.forEach(p => {
      const typeCfg = TYPES[p.type];
      const isFav = profile.favorites.includes(p.id);
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background:${typeCfg.color};width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:3px solid ${isFav ? '#E91E63' : '#fff'};box-shadow:0 3px 10px rgba(0,0,0,0.3);"><span style="transform:rotate(45deg);font-size:16px;">${typeCfg.icon}</span></div>${isFav ? '<div style="position:absolute;top:-4px;right:-4px;background:#E91E63;width:14px;height:14px;border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:9px;">❤</div>' : ''}`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });
      const marker = L.marker([p.lat, p.lng], { icon }).addTo(mapInstance.current);
      marker.on('click', () => { setSelectedPlace(p); setView('place'); });
      markersRef.current.push(marker);
    });
  };

  useEffect(() => { refreshMarkers(); }, [filteredPlaces, profile.favorites]);

  // Vérifier badges & niveau
  const checkProgression = (newProfile) => {
    const oldLevel = getLevel(profile.xp);
    const newLevel = getLevel(newProfile.xp);
    if (newLevel.name !== oldLevel.name) {
      setShowLevelUp(newLevel);
      setTimeout(() => setShowLevelUp(null), 3500);
    }
    const newBadges = BADGES.filter(b => b.check(newProfile, places) && !newProfile.badges.includes(b.id));
    if (newBadges.length > 0) {
      newProfile.badges = [...newProfile.badges, ...newBadges.map(b => b.id)];
      newBadges.forEach((b, i) => setTimeout(() => showToast(`🏅 Badge débloqué : ${b.name}`), i * 1500));
    }
    return newProfile;
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  // Check-in sur un lieu
  const handleCheckin = (placeId) => {
    if (profile.checkins.includes(placeId)) {
      showToast('Déjà visité !');
      return;
    }
    // Vérification GPS : l'utilisateur doit être à moins de 200m du lieu
    const place = places.find(p => p.id === placeId);
    if (userLocation && place) {
      const dist = haversine(userLocation.lat, userLocation.lng, place.lat, place.lng);
      if (dist > 0.2) { // plus de 200m
        const ok = window.confirm(`Vous êtes à ${dist < 1 ? Math.round(dist*1000)+'m' : dist.toFixed(1)+'km'} du lieu. Le check-in est normalement vérifié par GPS sur place. Confirmer quand même ?`);
        if (!ok) return;
      }
    }
    let newProfile = { ...profile, checkins: [...profile.checkins, placeId], xp: profile.xp + 20 };
    newProfile = checkProgression(newProfile);
    setProfile(newProfile);
    showToast('✅ Check-in +20 XP');
  };

  // Ajouter un avis
  const handleAddReview = (placeId, rating, text) => {
    const updatedPlaces = places.map(p => p.id === placeId ? { ...p, reviews: [...p.reviews, { user: profile.name, rating, text }] } : p);
    setPlaces(updatedPlaces);
    if (selectedPlace?.id === placeId) setSelectedPlace(updatedPlaces.find(p => p.id === placeId));
    let newProfile = { ...profile, reviews: profile.reviews + 1, xp: profile.xp + 15 };
    newProfile = checkProgression(newProfile);
    setProfile(newProfile);
    showToast('💬 Avis publié +15 XP');
  };

  // Ajouter un lieu
  const handleAddPlace = (newPlace) => {
    // Détection doublon : même nom normalisé à moins de 100m
    const existing = places.find(p => {
      const sameName = normalize(p.name) === normalize(newPlace.name);
      const dist = haversine(p.lat, p.lng, newPlace.lat, newPlace.lng);
      return sameName || dist < 0.1; // 100 m
    });
    if (existing) {
      const ok = window.confirm(`Un lieu similaire existe déjà : "${existing.name}". Voulez-vous quand même l'ajouter ?`);
      if (!ok) return;
    }
    const place = { ...newPlace, id: 'u' + Date.now(), reviews: [], photos: [], verified: false };
    setPlaces([...places, place]);
    let newProfile = { ...profile, contributions: profile.contributions + 1, xp: profile.xp + 50 };
    newProfile = checkProgression(newProfile);
    setProfile(newProfile);
    setView('map');
    showToast('🌟 Lieu ajouté +50 XP !');
  };

  // ==================================================
  // STYLES INLINE — Palette terracotta / sauge / crème
  // ==================================================
  let theme = dark ? {
    bg: '#1a1612', surface: '#252019', surfaceAlt: '#2e2820',
    text: '#f0ebe0', textDim: '#b8ad96', border: '#3d3528',
    accent: '#E07856', accent2: '#D4A574', success: '#5A9367',
  } : {
    bg: '#F5EFE0', surface: '#FFFBF0', surfaceAlt: '#FAF3E0',
    text: '#2E2618', textDim: '#6B5B43', border: '#E5D9BC',
    accent: '#C65D3F', accent2: '#B8894F', success: '#4A7D53',
  };

  // Mode contraste élevé (WCAG AAA)
  if (highContrast) {
    theme = dark ? {
      bg: '#000000', surface: '#0a0a0a', surfaceAlt: '#141414',
      text: '#ffffff', textDim: '#e0e0e0', border: '#606060',
      accent: '#FFAA00', accent2: '#00E5FF', success: '#00E676',
    } : {
      bg: '#ffffff', surface: '#f8f8f8', surfaceAlt: '#f0f0f0',
      text: '#000000', textDim: '#2a2a2a', border: '#000000',
      accent: '#B8000F', accent2: '#0033CC', success: '#006600',
    };
  }

  // Mode contraste élevé (WCAG AAA)
  if (highContrast) {
    theme = dark ? {
      bg: '#000000', surface: '#0a0a0a', surfaceAlt: '#141414',
      text: '#ffffff', textDim: '#e0e0e0', border: '#606060',
      accent: '#FFAA00', accent2: '#00E5FF', success: '#00E676',
    } : {
      bg: '#ffffff', surface: '#f8f8f8', surfaceAlt: '#f0f0f0',
      text: '#000000', textDim: '#2a2a2a', border: '#000000',
      accent: '#B8000F', accent2: '#0033CC', success: '#006600',
    };
  }

  const fontDisplay = "'Fraunces', Georgia, serif";
  const fontBody = "'Inter', system-ui, sans-serif";

  if (loading) {
    return (
      <div style={{background: theme.bg, color: theme.text, minHeight: '100vh', display:'flex',alignItems:'center',justifyContent:'center', fontFamily: fontBody}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize: 48, marginBottom: 16}}>♿</div>
          <div style={{fontFamily: fontDisplay, fontSize: 24, letterSpacing: '-0.02em'}}>Chargement de Périgueux…</div>
        </div>
      </div>
    );
  }

  const currentLevel = getLevel(profile.xp);
  const nextLevel = getNextLevel(profile.xp);
  const progressPct = nextLevel ? ((profile.xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  return (
    <div style={{
      background: theme.bg,
      color: theme.text,
      minHeight: '100vh',
      fontFamily: fontBody,
      paddingBottom: 90,
      fontSize: `${textSize}%`,
    }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;800;900&family=Inter:wght@400;500;600;700&display=swap" />
      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translate(-50%,-20px);}to{opacity:1;transform:translate(-50%,0);} }
        @keyframes popIn { 0%{transform:scale(0.5);opacity:0;} 60%{transform:scale(1.1);} 100%{transform:scale(1);opacity:1;} }
        @keyframes pulse { from{background:rgba(233,30,99,0.94);}to{background:rgba(198,20,80,1);} }
        @keyframes userPulse {
          0%   { box-shadow: 0 0 0 0 rgba(33,150,243,0.5); }
          70%  { box-shadow: 0 0 0 12px rgba(33,150,243,0); }
          100% { box-shadow: 0 0 0 0 rgba(33,150,243,0); }
        }
        html,body { margin:0;padding:0;min-height:100vh;overscroll-behavior:none;background:${theme.bg}; }
        #root { min-height:100vh;background:${theme.bg}; }
        .leaflet-container { font-family:${fontBody} !important; touch-action: none !important; }
        .leaflet-grab { cursor: grab !important; }
        .leaflet-dragging .leaflet-grab { cursor: grabbing !important; }
        button:focus-visible { outline:2px solid ${theme.accent};outline-offset:2px; }
      `}</style>

      {/* HEADER */}
      <header style={{
        background: theme.surface,
        borderBottom: `1px solid ${theme.border}`,
        padding: '14px 18px',
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', // Ombre pour bien séparer du contenu
        // Effet de verre dépoli pour mieux voir à travers
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{
            width: 38, height: 38, background: theme.accent,
            borderRadius: '50% 50% 50% 10%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 20,
          }}>♿</div>
          <div>
            <div style={{ fontFamily: fontDisplay, fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em', lineHeight: 1 }}>PérigueuxAccess</div>
            <div style={{ fontSize: 10, color: theme.textDim, letterSpacing: '0.1em', textTransform: 'uppercase' }}>La ville pour tous</div>
          </div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div style={{
            background: theme.surfaceAlt, padding: '6px 10px', borderRadius: 20,
            fontSize: 12, fontWeight: 600, display:'flex',alignItems:'center',gap:4,
            border: `1px solid ${theme.border}`,
          }}>
            <Sparkles size={13} style={{color: theme.accent2}}/> {profile.xp} XP
          </div>
          <button onClick={() => setDark(!dark)} aria-label="Changer thème" style={{
            background: 'none', border: `1px solid ${theme.border}`, borderRadius: '50%',
            width: 36, height: 36, display:'flex',alignItems:'center',justifyContent:'center',
            color: theme.text, cursor: 'pointer',
          }}>
            {dark ? <Sun size={16}/> : <Moon size={16}/>}
          </button>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      {/* MapView TOUJOURS monté — juste caché quand on est sur un autre onglet */}
      {/* Cela évite que Leaflet soit détruit/recréé à chaque changement d'onglet */}
      <div style={{ display: view === 'map' ? 'block' : 'none' }}>
        <MapView
          theme={theme} fontDisplay={fontDisplay}
          mapRef={mapRef} filters={filters} setFilters={setFilters}
          showFilters={showFilters} setShowFilters={setShowFilters}
          places={places} filteredPlaces={filteredPlaces}
          onSelectPlace={(p) => { setSelectedPlace(p); setView('place'); }}
          userLocation={userLocation} locationStatus={locationStatus}
          onRequestLocation={requestLocation}
          profile={profile} onToggleFavorite={toggleFavorite}
          onRecenter={recenterMap}
        />
      </div>

      {view === 'place' && selectedPlace && (
        <PlaceDetail
          theme={theme} fontDisplay={fontDisplay}
          place={selectedPlace} profile={profile}
          onBack={() => setView('map')}
          onCheckin={() => handleCheckin(selectedPlace.id)}
          onAddReview={(r, t) => handleAddReview(selectedPlace.id, r, t)}
          onToggleFavorite={() => toggleFavorite(selectedPlace.id)}
          onShare={() => sharePlace(selectedPlace)}
          onDirections={() => openDirections(selectedPlace)}
          userLocation={userLocation}
        />
      )}

      {view === 'profile' && (
        <ProfileView
          theme={theme} fontDisplay={fontDisplay}
          profile={profile} setProfile={setProfile}
          places={places} currentLevel={currentLevel} nextLevel={nextLevel}
          progressPct={progressPct}
          textSize={textSize} setTextSize={setTextSize}
          highContrast={highContrast} setHighContrast={setHighContrast}
          onSelectPlace={(p) => { setSelectedPlace(p); setView('place'); }}
          onShowLegal={() => setView('legal')}
        />
      )}

      {view === 'legal' && (
        <LegalView theme={theme} fontDisplay={fontDisplay} onBack={() => setView('profile')} />
      )}

      {view === 'leaderboard' && (
        <LeaderboardView theme={theme} fontDisplay={fontDisplay} profile={profile} leaderboard={leaderboard} setLeaderboard={setLeaderboard} />
      )}

      {view === 'add' && (
        <AddPlaceView theme={theme} fontDisplay={fontDisplay} onAdd={handleAddPlace} onCancel={() => setView('map')} />
      )}

      {view === 'diabete' && (
        <DiabeteView
          theme={theme} fontDisplay={fontDisplay}
          places={places} userLocation={userLocation}
          onRequestLocation={requestLocation} locationStatus={locationStatus}
          onSelectPlace={(p) => { setSelectedPlace(p); setView('place'); }}
          onDirections={openDirections}
          profile={profile}
          onTriggerSOS={triggerSOS}
          onAddGlycemie={addGlycemie}
          onDeleteGlycemie={deleteGlycemie}
        />
      )}

      {/* NAVIGATION BASSE */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: theme.surface, borderTop: `1px solid ${theme.border}`,
        display: 'flex', justifyContent: 'space-around', padding: '10px 0 14px',
        zIndex: 99,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)', // Ombre vers le haut pour bien séparer
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        // Support des téléphones avec encoche (iPhone X+)
        paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
      }}>
        {[
          { id: 'map', icon: MapPin, label: 'Carte' },
          { id: 'diabete', icon: Heart, label: 'Diabète' },
          { id: 'add', icon: Plus, label: 'Ajouter' },
          { id: 'leaderboard', icon: Trophy, label: 'Top' },
          { id: 'profile', icon: User, label: 'Moi' },
        ].map(item => (
          <button key={item.id} onClick={() => setView(item.id)} aria-label={item.label} style={{
            background: 'none', border: 'none',
            color: view === item.id ? (item.id === 'diabete' ? '#E91E63' : theme.accent) : theme.textDim,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            cursor: 'pointer', padding: '4px 6px', fontFamily: fontBody, fontSize: 9,
            fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
            transition: 'color 0.2s', minWidth: 0,
          }}>
            <item.icon size={22} strokeWidth={view === item.id ? 2.5 : 1.8} fill={item.id === 'diabete' && view === item.id ? '#E91E63' : 'none'}/>
            {item.label}
          </button>
        ))}
      </nav>

      {/* 👋 MODALE ONBOARDING — 1ER LANCEMENT */}
      {showOnboarding && (
        <div role="dialog" aria-label="Bienvenue" style={{
          position: 'fixed', inset: 0, zIndex: 450,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}>
          <div style={{
            background: theme.surface, borderRadius: 24, padding: '30px 24px',
            maxWidth: 360, width: '100%', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'popIn 0.4s ease',
            maxHeight: '85vh', overflowY: 'auto',
          }}>
            <div style={{fontSize: 56, marginBottom: 12}}>♿</div>
            <div style={{fontFamily: fontDisplay, fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8}}>
              Bienvenue sur <span style={{color: theme.accent, fontStyle: 'italic'}}>PérigueuxAccess</span>
            </div>
            <div style={{fontSize: 13, color: theme.textDim, lineHeight: 1.5, marginBottom: 20}}>
              L'application citoyenne qui cartographie l'accessibilité à Périgueux
            </div>

            <div style={{textAlign: 'left', marginBottom: 20}}>
              {[
                { icon: '🗺️', title: 'Explorez la carte', desc: '96 lieux accessibles à Périgueux' },
                { icon: '📍', title: 'Activez votre position', desc: 'Pour voir les lieux les plus proches' },
                { icon: '🩸', title: 'Espace Diabète', desc: 'SOS, pharmacies 24h/24, carnet glycémie' },
                { icon: '❤️', title: 'Sauvez vos favoris', desc: 'Retrouvez vos lieux préférés' },
                { icon: '🏆', title: 'Gagnez des points', desc: 'Contribuez et devenez Légende !' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0', borderBottom: i < 4 ? `1px solid ${theme.border}` : 'none',
                }}>
                  <div style={{fontSize: 24, flexShrink: 0}}>{item.icon}</div>
                  <div style={{flex: 1}}>
                    <div style={{fontSize: 13, fontWeight: 700}}>{item.title}</div>
                    <div style={{fontSize: 11, color: theme.textDim, marginTop: 2}}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={async () => {
              await window.storage.set('onboarding_seen', 'yes').catch(()=>{});
              setShowOnboarding(false);
              showToast("👋 Bienvenue Lucas !");
            }} style={{
              width: '100%', background: theme.accent, color: '#fff',
              border: 'none', borderRadius: 14, padding: 14,
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              Commencer l'exploration →
            </button>

            <button onClick={async () => {
              await window.storage.set('onboarding_seen', 'yes').catch(()=>{});
              setShowOnboarding(false);
            }} style={{
              background: 'none', border: 'none', color: theme.textDim,
              padding: 10, marginTop: 6, cursor: 'pointer', fontSize: 11,
              fontFamily: 'inherit', textDecoration: 'underline',
            }}>
              Passer cette introduction
            </button>
          </div>
        </div>
      )}

      {/* 🚨 MODALE SOS HYPOGLYCÉMIE */}
      {sosActive && (() => {
        const sugarPlaces = places.filter(p => p.type === 'sucre');
        // Fallback : si aucun lieu sucre (edge case), on prend n'importe quelle pharmacie
        const fallbackPlaces = sugarPlaces.length > 0 ? sugarPlaces : places.filter(p => p.name.startsWith('💊'));
        const closest = fallbackPlaces.length === 0 ? null
          : userLocation
            ? [...fallbackPlaces].sort((a,b) => haversine(userLocation.lat,userLocation.lng,a.lat,a.lng) - haversine(userLocation.lat,userLocation.lng,b.lat,b.lng))[0]
            : fallbackPlaces.find(p => (p.hours || '').includes('24h/24')) || fallbackPlaces[0];
        const dist = closest && userLocation ? haversine(userLocation.lat,userLocation.lng,closest.lat,closest.lng) : null;
        return (
          <div role="alertdialog" aria-label="Alerte hypoglycémie" style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'rgba(233, 30, 99, 0.96)', color: '#fff',
            display: 'flex', flexDirection: 'column',
            animation: 'pulse 1s ease-in-out infinite alternate',
            padding: 20, overflowY: 'auto',
          }}>
            <div style={{display:'flex',justifyContent:'flex-end'}}>
              <button onClick={closeSOS} aria-label="Fermer l'alerte" style={{
                background: 'rgba(255,255,255,0.2)', border: '2px solid #fff', color: '#fff',
                borderRadius: '50%', width: 44, height: 44, cursor: 'pointer',
                display:'flex',alignItems:'center',justifyContent:'center',
              }}><X size={22}/></button>
            </div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', maxWidth: 400, margin: '0 auto', width: '100%'}}>
              <div style={{fontSize: 80, marginBottom: 10}}>🚨</div>
              <div style={{fontFamily: fontDisplay, fontSize: 36, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 14}}>
                ALERTE HYPOGLYCÉMIE
              </div>
              <div style={{fontSize: 15, marginBottom: 22, opacity: 0.95, lineHeight: 1.4}}>
                Prenez du <strong>sucre rapide IMMÉDIATEMENT</strong> (15g).<br/>
                Asseyez-vous si possible.
              </div>

              {closest && (
                <div style={{
                  background: '#fff', color: '#E91E63', borderRadius: 16, padding: 16,
                  marginBottom: 14, textAlign: 'left',
                }}>
                  <div style={{fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6}}>
                    ⚡ Lieu le plus proche
                  </div>
                  <div style={{fontFamily: fontDisplay, fontSize: 18, fontWeight: 800, marginBottom: 4}}>
                    {closest.name}
                  </div>
                  <div style={{fontSize: 13, opacity: 0.8, marginBottom: 10}}>
                    📍 {closest.address}<br/>
                    🕐 {closest.hours}
                    {dist !== null && <><br/>🚶 {dist < 1 ? `${Math.round(dist*1000)} m` : `${dist.toFixed(1)} km`}</>}
                  </div>
                  <button onClick={() => openDirections(closest)} style={{
                    width: '100%', background: '#E91E63', color: '#fff', border: 'none',
                    borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer',
                    display:'flex',alignItems:'center',justifyContent:'center',gap: 8,
                  }}>
                    <Route size={20}/> M'Y EMMENER
                  </button>
                </div>
              )}

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10, marginBottom: 10}}>
                <a href="tel:15" style={{
                  background: '#fff', color: '#E91E63', borderRadius: 14,
                  padding: '16px 10px', textAlign: 'center', textDecoration: 'none',
                  fontWeight: 900, fontSize: 14,
                }}>
                  <div style={{fontSize: 24}}>📞</div>
                  <div style={{marginTop: 4}}>SAMU — 15</div>
                </a>
                <a href="tel:112" style={{
                  background: '#fff', color: '#E91E63', borderRadius: 14,
                  padding: '16px 10px', textAlign: 'center', textDecoration: 'none',
                  fontWeight: 900, fontSize: 14,
                }}>
                  <div style={{fontSize: 24}}>🚑</div>
                  <div style={{marginTop: 4}}>Urgences — 112</div>
                </a>
              </div>

              <div style={{fontSize: 11, opacity: 0.85, marginTop: 8, lineHeight: 1.5}}>
                Après avoir sucré, attendez 15 min et recontrôlez.<br/>
                Si perte de conscience imminente : appelez le 15.
              </div>
            </div>
          </div>
        );
      })()}

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
          background: theme.text, color: theme.bg, padding: '12px 22px', borderRadius: 30,
          fontSize: 14, fontWeight: 600, zIndex: 200, boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          animation: 'slideDown 0.3s ease',
        }}>{toast}</div>
      )}

      {/* LEVEL UP MODAL */}
      {showLevelUp && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div style={{
            background: theme.surface, borderRadius: 24, padding: '40px 30px',
            textAlign: 'center', maxWidth: 320, border: `2px solid ${theme.accent}`,
            animation: 'popIn 0.5s ease',
          }}>
            <div style={{fontSize: 72, marginBottom: 10}}>{showLevelUp.icon}</div>
            <div style={{fontFamily: fontDisplay, fontSize: 14, color: theme.textDim, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8}}>Niveau atteint</div>
            <div style={{fontFamily: fontDisplay, fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', color: theme.accent}}>{showLevelUp.name}</div>
          </div>
        </div>
      )}

    </div>
  );
}

// ======================================================
// VUE CARTE
// ======================================================
function MapView({ theme, fontDisplay, mapRef, filters, setFilters, showFilters, setShowFilters, places, filteredPlaces, onSelectPlace, userLocation, locationStatus, onRequestLocation, profile, onToggleFavorite, onRecenter }) {
  const activeCount = places.length;
  const shownCount = filteredPlaces.length;

  return (
    <div>
      {/* Bannière accueil */}
      <div style={{
        padding: '20px 20px 16px', background: `linear-gradient(135deg, ${theme.surface} 0%, ${theme.surfaceAlt} 100%)`,
        borderBottom: `1px solid ${theme.border}`,
      }}>
        <div style={{fontFamily: fontDisplay, fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 4}}>
          Explorez <span style={{fontStyle: 'italic', color: theme.accent}}>Périgueux</span>
        </div>
        <div style={{fontSize: 13, color: theme.textDim, marginBottom: 14}}>
          {shownCount} lieu{shownCount>1?'x':''} accessible{shownCount>1?'s':''} sur {activeCount}
          {userLocation && filters.sortBy === 'distance' && ' • triés par distance'}
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div style={{flex:1, position:'relative'}}>
            <Search size={16} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:theme.textDim}}/>
            <input
              type="text" placeholder="Chercher (nom, rue, quartier)…"
              value={filters.search}
              onChange={e => setFilters({...filters, search: e.target.value})}
              style={{
                width: '100%', padding: '10px 14px 10px 38px',
                background: theme.surface, border: `1px solid ${theme.border}`,
                borderRadius: 12, color: theme.text, fontSize: 14,
                fontFamily: 'inherit', outline: 'none',
              }}
            />
            {filters.search && (
              <button onClick={() => setFilters({...filters, search: ''})} aria-label="Effacer la recherche" style={{
                position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',
                background:'none',border:'none',color:theme.textDim,cursor:'pointer',padding:4,
              }}><X size={16}/></button>
            )}
          </div>
          <button onClick={() => setShowFilters(!showFilters)} aria-label="Filtres" style={{
            background: showFilters ? theme.accent : theme.surface,
            color: showFilters ? '#fff' : theme.text,
            border: `1px solid ${theme.border}`, borderRadius: 12,
            width: 42, height: 42, display:'flex',alignItems:'center',justifyContent:'center',
            cursor: 'pointer', flexShrink: 0,
          }}>
            <Filter size={18}/>
          </button>
        </div>

        {/* Barre d'actions rapides */}
        <div style={{display:'flex',gap:8,marginTop:10,overflowX:'auto',paddingBottom:2}}>
          <button
            onClick={userLocation ? onRecenter : onRequestLocation}
            aria-label="Me localiser"
            style={{
              background: userLocation ? theme.success : theme.surface,
              color: userLocation ? '#fff' : theme.text,
              border: `1px solid ${userLocation ? theme.success : theme.border}`,
              borderRadius: 20, padding: '7px 12px', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', display:'flex',alignItems:'center',gap:5, flexShrink: 0,
            }}>
            <Locate size={14}/>
            {locationStatus === 'loading' ? 'Localisation…' : userLocation ? '📍 Ma position' : 'Me localiser'}
          </button>

          <button onClick={() => setFilters({...filters, favoritesOnly: !filters.favoritesOnly})} aria-pressed={filters.favoritesOnly} style={{
            background: filters.favoritesOnly ? '#E91E63' : theme.surface,
            color: filters.favoritesOnly ? '#fff' : theme.text,
            border: `1px solid ${filters.favoritesOnly ? '#E91E63' : theme.border}`,
            borderRadius: 20, padding: '7px 12px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', display:'flex',alignItems:'center',gap:5, flexShrink: 0,
          }}>
            <Heart size={14} fill={filters.favoritesOnly ? '#fff' : 'none'}/> Favoris ({profile.favorites.length})
          </button>

          <select value={filters.sortBy} onChange={e => setFilters({...filters, sortBy: e.target.value})}
            aria-label="Trier les lieux" style={{
              background: theme.surface, color: theme.text,
              border: `1px solid ${theme.border}`, borderRadius: 20,
              padding: '7px 12px', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit',
            }}>
            <option value="distance">📍 Par distance</option>
            <option value="score">⭐ Par score</option>
            <option value="name">🔤 Par nom</option>
          </select>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div style={{padding: '14px 20px', background: theme.surfaceAlt, borderBottom: `1px solid ${theme.border}`}}>
          <div style={{fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: theme.textDim}}>Types de lieux</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:12}}>
            <button onClick={() => setFilters({...filters, types: Object.keys(TYPES)})} style={{
              background: filters.types.length === Object.keys(TYPES).length ? theme.text : theme.surface,
              color: filters.types.length === Object.keys(TYPES).length ? theme.bg : theme.text,
              border: `1px solid ${theme.border}`, borderRadius: 20,
              padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>✓ Tout</button>
            {Object.entries(TYPES).map(([key, cfg]) => {
              const active = filters.types.includes(key);
              return (
                <button key={key} onClick={() => {
                  setFilters({...filters, types: active ? filters.types.filter(t=>t!==key) : [...filters.types, key]});
                }} style={{
                  background: active ? cfg.color : theme.surface,
                  color: active ? '#fff' : theme.text,
                  border: `1px solid ${active ? cfg.color : theme.border}`,
                  borderRadius: 20, padding: '6px 12px', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', display:'flex',alignItems:'center',gap:4,
                }}>
                  <span>{cfg.icon}</span> {cfg.label}
                </button>
              );
            })}
          </div>
          <div style={{fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: theme.textDim}}>Handicap</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:12}}>
            {Object.entries(DISABILITIES).map(([key, cfg]) => {
              const active = filters.disabilities.includes(key);
              const Icon = cfg.icon;
              return (
                <button key={key} onClick={() => {
                  setFilters({...filters, disabilities: active ? filters.disabilities.filter(d=>d!==key) : [...filters.disabilities, key]});
                }} style={{
                  background: active ? theme.accent : theme.surface,
                  color: active ? '#fff' : theme.text,
                  border: `1px solid ${active ? theme.accent : theme.border}`,
                  borderRadius: 20, padding: '6px 12px', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', display:'flex',alignItems:'center',gap:5,
                }}>
                  <Icon size={13}/> {cfg.label}
                </button>
              );
            })}
          </div>
          <div style={{fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: theme.textDim}}>Score minimum : {filters.minScore}/5</div>
          <input type="range" min="0" max="5" value={filters.minScore} onChange={e => setFilters({...filters, minScore: parseInt(e.target.value)})}
            style={{width:'100%', accentColor: theme.accent}}/>
        </div>
      )}

      {/* Bandeau "aucun résultat" */}
      {filteredPlaces.length === 0 && (
        <div style={{
          position: 'absolute', top: 280, left: '50%', transform: 'translateX(-50%)',
          background: theme.surface, border: `2px solid ${theme.accent}`,
          borderRadius: 16, padding: 18, maxWidth: 320, zIndex: 400,
          textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          margin: '0 20px',
        }}>
          <div style={{fontSize: 36, marginBottom: 8}}>🔍</div>
          <div style={{fontFamily: fontDisplay, fontSize: 17, fontWeight: 700, marginBottom: 6}}>
            Aucun lieu trouvé
          </div>
          <div style={{fontSize: 12, color: theme.textDim, lineHeight: 1.5, marginBottom: 12}}>
            Essayez de modifier vos filtres ou élargir votre recherche.
          </div>
          <button onClick={() => setFilters({
            types: Object.keys(TYPES), disabilities: [], minScore: 0,
            search: '', sortBy: filters.sortBy, favoritesOnly: false,
          })} style={{
            background: theme.accent, color: '#fff', border: 'none',
            borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            ↺ Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Carte avec bouton recentrer flottant */}
      <div style={{position: 'relative'}}>
        <div
          ref={mapRef}
          style={{
            height: 'calc(100vh - 260px)',
            minHeight: 400,
            width: '100%',
            touchAction: 'none', // ✅ Laisse Leaflet gérer tous les gestes tactiles
            cursor: 'grab',
          }}
        />
        {userLocation && (
          <button
            onClick={onRecenter}
            aria-label="Recentrer sur ma position"
            style={{
              position: 'absolute', bottom: 20, right: 14, zIndex: 400,
              background: '#2196F3', color: '#fff',
              border: '3px solid #fff', borderRadius: '50%',
              width: 52, height: 52, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            }}>
            <Locate size={22}/>
          </button>
        )}
      </div>
    </div>
  );
}

// ======================================================
// VUE DÉTAIL D'UN LIEU
// ======================================================
function PlaceDetail({ theme, fontDisplay, place, profile, onBack, onCheckin, onAddReview, onToggleFavorite, onShare, onDirections, userLocation }) {
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const typeCfg = TYPES[place.type];
  const hasVisited = profile.checkins.includes(place.id);
  const isFav = profile.favorites.includes(place.id);
  const avgRating = place.reviews.length > 0 ? place.reviews.reduce((s,r)=>s+r.rating,0)/place.reviews.length : place.score;

  // Distance si géoloc
  const distanceKm = userLocation
    ? Math.round(haversine(userLocation.lat, userLocation.lng, place.lat, place.lng) * 10) / 10
    : null;

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(180deg, ${typeCfg.color}22 0%, ${theme.bg} 100%)`,
        padding: '20px 20px 30px',
      }}>
        <button onClick={onBack} style={{
          background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 10,
          padding: '8px 14px', color: theme.text, cursor: 'pointer', marginBottom: 16,
          fontSize: 13, fontFamily: 'inherit', display:'flex',alignItems:'center',gap:4,
        }}>← Retour carte</button>

        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
          <span style={{
            background: typeCfg.color, color: '#fff', padding: '4px 10px',
            borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>{typeCfg.icon} {typeCfg.label}</span>
          {place.verified && <span style={{fontSize: 11, color: theme.success, display:'flex',alignItems:'center',gap:3}}><Check size={12}/> Vérifié</span>}
        </div>

        <h1 style={{fontFamily: fontDisplay, fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 6px'}}>
          {place.name}
        </h1>
        <div style={{fontSize: 13, color: theme.textDim, marginBottom: 14}}>
          📍 {place.address}
        </div>

        {/* Score */}
        <div style={{display:'flex',alignItems:'center',gap:12, marginBottom: 16}}>
          <div style={{
            background: theme.surface, borderRadius: 16, padding: '10px 16px',
            display:'flex',alignItems:'center',gap:6, border: `1px solid ${theme.border}`,
          }}>
            <Star size={18} fill={theme.accent2} color={theme.accent2}/>
            <span style={{fontFamily: fontDisplay, fontSize: 22, fontWeight: 800}}>{avgRating.toFixed(1)}</span>
            <span style={{fontSize: 12, color: theme.textDim}}>/ 5</span>
          </div>
          <div style={{fontSize: 12, color: theme.textDim}}>
            {place.reviews.length} avis<br/>
            Score d'accessibilité
          </div>
        </div>

        {/* Check-in */}
        <button onClick={onCheckin} disabled={hasVisited} style={{
          width: '100%', background: hasVisited ? theme.surfaceAlt : theme.accent,
          color: hasVisited ? theme.textDim : '#fff',
          border: 'none', borderRadius: 14, padding: '14px',
          fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
          cursor: hasVisited ? 'default' : 'pointer',
          display:'flex',alignItems:'center',justifyContent:'center',gap:8,
        }}>
          {hasVisited ? <><Check size={18}/> Lieu déjà visité</> : <><Navigation size={18}/> Je suis sur place (+20 XP)</>}
        </button>

        {/* Barre d'actions : Itinéraire / Partage / Favoris */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap: 8, marginTop: 10}}>
          <button onClick={onDirections} aria-label="Obtenir l'itinéraire" style={{
            background: theme.surface, color: theme.text,
            border: `1px solid ${theme.border}`, borderRadius: 12,
            padding: '10px 6px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit', display:'flex',flexDirection:'column',alignItems:'center',gap:4,
          }}>
            <Route size={18} color={theme.accent}/>
            Itinéraire
          </button>
          <button onClick={onShare} aria-label="Partager ce lieu" style={{
            background: theme.surface, color: theme.text,
            border: `1px solid ${theme.border}`, borderRadius: 12,
            padding: '10px 6px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit', display:'flex',flexDirection:'column',alignItems:'center',gap:4,
          }}>
            <Share2 size={18} color={theme.accent}/>
            Partager
          </button>
          <button onClick={onToggleFavorite} aria-pressed={isFav} aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'} style={{
            background: isFav ? '#E91E63' : theme.surface,
            color: isFav ? '#fff' : theme.text,
            border: `1px solid ${isFav ? '#E91E63' : theme.border}`, borderRadius: 12,
            padding: '10px 6px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit', display:'flex',flexDirection:'column',alignItems:'center',gap:4,
          }}>
            <Heart size={18} fill={isFav ? '#fff' : 'none'} color={isFav ? '#fff' : theme.accent}/>
            {isFav ? 'Favori' : 'Sauver'}
          </button>
        </div>

        {/* Distance */}
        {distanceKm !== null && (
          <div style={{
            marginTop: 10, textAlign: 'center', fontSize: 13, color: theme.textDim,
            background: theme.surface, border: `1px solid ${theme.border}`,
            borderRadius: 10, padding: '8px 12px',
          }}>
            📍 À <strong style={{color: theme.text}}>{distanceKm < 1 ? `${Math.round(distanceKm*1000)} m` : `${distanceKm} km`}</strong> de vous
          </div>
        )}
      </div>

      {/* Handicaps pris en charge */}
      <div style={{padding: '0 20px 16px'}}>
        <h3 style={{fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textDim, marginTop: 20, marginBottom: 10}}>Handicaps pris en charge</h3>
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {place.disabilities.map(d => {
            const cfg = DISABILITIES[d];
            const Icon = cfg.icon;
            return (
              <div key={d} style={{
                background: theme.surface, border: `1px solid ${theme.border}`,
                borderRadius: 12, padding: '8px 14px', fontSize: 13,
                display:'flex',alignItems:'center',gap:6, fontWeight: 600,
              }}>
                <Icon size={15} color={theme.accent}/> {cfg.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Équipements */}
      <div style={{padding: '0 20px 16px'}}>
        <h3 style={{fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textDim, marginBottom: 10}}>Équipements</h3>
        <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
          {place.equipment.map(e => (
            <span key={e} style={{
              background: theme.surface, border: `1px solid ${theme.border}`,
              borderRadius: 20, padding: '6px 12px', fontSize: 12, fontWeight: 500,
              display:'flex',alignItems:'center',gap:4,
            }}>
              <Check size={12} color={theme.success}/> {EQUIPMENT_LABELS[e] || e}
            </span>
          ))}
        </div>
      </div>

      {/* Infos pratiques */}
      <div style={{padding: '0 20px 16px'}}>
        <h3 style={{fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textDim, marginBottom: 10}}>Informations</h3>
        <div style={{background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 14, fontSize: 14}}>
          <div style={{marginBottom: 6}}><strong>Horaires :</strong> {place.hours || '—'}</div>
          {place.phone && <div style={{marginBottom: 6}}><strong>Téléphone :</strong> {place.phone}</div>}
          <div><strong>Quartier :</strong> {place.quartier}</div>
        </div>
      </div>

      {/* Avis */}
      <div style={{padding: '0 20px 30px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom: 10}}>
          <h3 style={{fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textDim, margin: 0}}>Avis ({place.reviews.length})</h3>
          <button onClick={() => setShowReviewForm(!showReviewForm)} style={{
            background: 'none', border: `1px solid ${theme.border}`, color: theme.accent,
            borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', display:'flex',alignItems:'center',gap:4,
          }}>
            <Plus size={13}/> Ajouter
          </button>
        </div>

        {showReviewForm && (
          <div style={{background: theme.surfaceAlt, borderRadius: 14, padding: 14, marginBottom: 12, border: `1px solid ${theme.border}`}}>
            <div style={{display:'flex',gap:4,marginBottom:10}}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setReviewRating(n)} aria-label={`${n} étoile${n>1?'s':''}`} style={{background:'none',border:'none',cursor:'pointer',padding:2}}>
                  <Star size={24} fill={n <= reviewRating ? theme.accent2 : 'transparent'} color={theme.accent2}/>
                </button>
              ))}
            </div>
            <textarea value={reviewText} onChange={e=>setReviewText(e.target.value.slice(0, 500))} placeholder="Partagez votre expérience… (500 caractères max)" rows={3} maxLength={500} style={{
              width: '100%', background: theme.surface, border: `1px solid ${theme.border}`,
              borderRadius: 10, padding: 10, color: theme.text, fontSize: 14,
              fontFamily: 'inherit', resize: 'vertical', outline: 'none', marginBottom: 4,
            }}/>
            <div style={{fontSize: 10, color: theme.textDim, textAlign: 'right', marginBottom: 8}}>
              {reviewText.length}/500 caractères
            </div>
            <button onClick={() => {
              const trimmed = reviewText.trim();
              if (trimmed.length < 3) { window.alert('Votre avis est trop court (minimum 3 caractères)'); return; }
              onAddReview(reviewRating, trimmed);
              setReviewText('');
              setShowReviewForm(false);
            }} style={{
              background: theme.accent, color: '#fff', border: 'none',
              borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>Publier (+15 XP)</button>
          </div>
        )}

        {place.reviews.length === 0 ? (
          <div style={{textAlign:'center',padding: 30, color: theme.textDim, fontSize: 13, fontStyle: 'italic'}}>Soyez le premier à donner votre avis.</div>
        ) : place.reviews.map((r, i) => (
          <div key={i} style={{background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 14, marginBottom: 10}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
              <div style={{fontWeight: 700, fontSize: 14}}>{r.user}</div>
              <div style={{display:'flex',gap:2}}>
                {[1,2,3,4,5].map(n => <Star key={n} size={13} fill={n<=r.rating?theme.accent2:'transparent'} color={theme.accent2}/>)}
              </div>
            </div>
            <div style={{fontSize: 13, lineHeight: 1.5, color: theme.textDim}}>{r.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ======================================================
// VUE PROFIL
// ======================================================
function ProfileView({ theme, fontDisplay, profile, setProfile, places, currentLevel, nextLevel, progressPct, textSize, setTextSize, highContrast, setHighContrast, onSelectPlace, onShowLegal }) {
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(profile.name);
  const earnedBadges = BADGES.filter(b => profile.badges.includes(b.id));
  const favoritePlaces = places.filter(p => profile.favorites.includes(p.id));

  return (
    <div style={{padding: '20px'}}>
      {/* En-tête profil */}
      <div style={{
        background: `linear-gradient(135deg, ${currentLevel.color}22 0%, ${theme.surface} 100%)`,
        borderRadius: 24, padding: 24, border: `1px solid ${theme.border}`,
        marginBottom: 18, textAlign: 'center',
      }}>
        <div style={{fontSize: 64, marginBottom: 8}}>{currentLevel.icon}</div>

        {editName ? (
          <div style={{display:'flex',gap:6,justifyContent:'center',marginBottom:8}}>
            <input value={name} onChange={e=>setName(e.target.value)} style={{
              background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8,
              padding: '6px 10px', color: theme.text, fontSize: 16, fontFamily: 'inherit',
              textAlign: 'center', width: 180, outline:'none',
            }}/>
            <button onClick={() => { setProfile({...profile, name}); setEditName(false); }} style={{
              background: theme.accent, color:'#fff', border:'none', borderRadius:8, padding:'6px 12px', cursor:'pointer', fontSize: 12, fontWeight: 700,
            }}>OK</button>
          </div>
        ) : (
          <h2 onClick={()=>setEditName(true)} style={{fontFamily: fontDisplay, fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 4px', cursor: 'pointer'}}>
            {profile.name}
          </h2>
        )}

        <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: currentLevel.color, marginBottom: 18}}>
          {currentLevel.name}
        </div>

        {/* Barre XP */}
        <div style={{marginBottom: 6}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize: 12, marginBottom: 4, color: theme.textDim}}>
            <span>{profile.xp} XP</span>
            {nextLevel && <span>{nextLevel.min} XP ({nextLevel.name})</span>}
          </div>
          <div style={{background: theme.surfaceAlt, height: 10, borderRadius: 20, overflow: 'hidden', border: `1px solid ${theme.border}`}}>
            <div style={{
              background: `linear-gradient(90deg, ${currentLevel.color}, ${theme.accent})`,
              height: '100%', width: `${progressPct}%`, borderRadius: 20, transition: 'width 0.5s',
            }}/>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap: 10, marginBottom: 20}}>
        <StatCard theme={theme} fontDisplay={fontDisplay} value={`${profile.checkins.length}/${places.length}`} label="Visites" icon="📍"/>
        <StatCard theme={theme} fontDisplay={fontDisplay} value={profile.contributions} label="Lieux ajoutés" icon="✍️"/>
        <StatCard theme={theme} fontDisplay={fontDisplay} value={profile.reviews} label="Avis" icon="💬"/>
      </div>

      {/* Badges */}
      <h3 style={{fontFamily: fontDisplay, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12}}>
        Badges <span style={{color: theme.textDim, fontSize: 14, fontWeight: 500}}>({earnedBadges.length}/{BADGES.length})</span>
      </h3>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))',gap: 10}}>
        {BADGES.map(b => {
          const earned = profile.badges.includes(b.id);
          return (
            <div key={b.id} style={{
              background: earned ? theme.surface : theme.surfaceAlt,
              border: `1px solid ${earned ? theme.accent : theme.border}`,
              borderRadius: 14, padding: 14, textAlign: 'center',
              opacity: earned ? 1 : 0.5,
            }}>
              <div style={{fontSize: 32, marginBottom: 6, filter: earned ? 'none' : 'grayscale(1)'}}>{b.icon}</div>
              <div style={{fontWeight: 700, fontSize: 13, marginBottom: 3}}>{b.name}</div>
              <div style={{fontSize: 11, color: theme.textDim, lineHeight: 1.3}}>{b.desc}</div>
            </div>
          );
        })}
      </div>

      {/* ♿ RÉGLAGES D'ACCESSIBILITÉ */}
      <div style={{
        marginTop: 24, background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: 16, padding: 18,
      }}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
          <Accessibility size={18} color={theme.accent}/>
          <h3 style={{fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', margin: 0}}>
            Accessibilité
          </h3>
        </div>

        {/* Taille du texte */}
        <div style={{marginBottom: 18}}>
          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
            <Type size={14} color={theme.textDim}/>
            <span style={{fontSize: 13, fontWeight: 600}}>Taille du texte</span>
            <span style={{marginLeft:'auto', fontSize: 12, color: theme.textDim, fontWeight: 600}}>{textSize}%</span>
          </div>
          <div style={{display:'flex',gap:6}}>
            {[100, 125, 150, 175].map(size => (
              <button key={size} onClick={() => setTextSize(size)} aria-pressed={textSize===size} style={{
                flex: 1,
                background: textSize === size ? theme.accent : theme.surfaceAlt,
                color: textSize === size ? '#fff' : theme.text,
                border: `1px solid ${textSize === size ? theme.accent : theme.border}`,
                borderRadius: 10, padding: '10px 6px',
                fontSize: size === 100 ? 11 : size === 125 ? 13 : size === 150 ? 15 : 17,
                fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                A
              </button>
            ))}
          </div>
          <div style={{fontSize: 11, color: theme.textDim, marginTop: 6, lineHeight: 1.4}}>
            Agrandit tous les textes de l'application pour une meilleure lisibilité.
          </div>
        </div>

        {/* Mode contraste élevé */}
        <div style={{
          display:'flex',alignItems:'center',justifyContent:'space-between',
          padding: '12px 0', borderTop: `1px solid ${theme.border}`,
        }}>
          <div style={{flex: 1, paddingRight: 10}}>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom: 3}}>
              <ZoomIn size={14} color={theme.textDim}/>
              <span style={{fontSize: 13, fontWeight: 600}}>Contraste élevé</span>
            </div>
            <div style={{fontSize: 11, color: theme.textDim, lineHeight: 1.4}}>
              Couleurs renforcées pour basse vision (norme WCAG AAA).
            </div>
          </div>
          <button onClick={() => setHighContrast(!highContrast)} role="switch" aria-checked={highContrast} aria-label="Activer le contraste élevé" style={{
            width: 52, height: 30, borderRadius: 15,
            background: highContrast ? theme.accent : theme.surfaceAlt,
            border: `1px solid ${theme.border}`,
            position: 'relative', cursor: 'pointer',
            transition: 'background 0.2s', flexShrink: 0,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 3, left: highContrast ? 26 : 3,
              transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}/>
          </button>
        </div>
      </div>

      {/* ❤️ MES FAVORIS */}
      {favoritePlaces.length > 0 && (
        <div style={{marginTop: 20}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
            <Heart size={18} color="#E91E63" fill="#E91E63"/>
            <h3 style={{fontFamily: fontDisplay, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', margin: 0}}>
              Mes favoris <span style={{color: theme.textDim, fontSize: 14, fontWeight: 500}}>({favoritePlaces.length})</span>
            </h3>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {favoritePlaces.map(p => {
              const typeCfg = TYPES[p.type];
              return (
                <button key={p.id} onClick={() => onSelectPlace && onSelectPlace(p)} style={{
                  background: theme.surface, border: `1px solid ${theme.border}`,
                  borderRadius: 14, padding: 12, cursor: 'pointer',
                  display:'flex',alignItems:'center',gap: 12, textAlign: 'left',
                  fontFamily: 'inherit', color: theme.text,
                }}>
                  <div style={{
                    width: 42, height: 42, background: typeCfg.color,
                    borderRadius: 12, display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize: 20, flexShrink: 0,
                  }}>{typeCfg.icon}</div>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{fontWeight: 700, fontSize: 14, marginBottom: 2, whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.name}</div>
                    <div style={{fontSize: 11, color: theme.textDim, display:'flex',alignItems:'center',gap:4}}>
                      <Star size={11} fill={theme.accent2} color={theme.accent2}/> {p.score}/5
                      <span style={{margin: '0 4px'}}>•</span>
                      {p.quartier}
                    </div>
                  </div>
                  <ChevronRight size={18} color={theme.textDim}/>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Défi de la semaine */}
      <div style={{
        marginTop: 24, background: theme.surface, border: `2px dashed ${theme.accent}`,
        borderRadius: 16, padding: 18,
      }}>
        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
          <Flame size={16} color={theme.accent}/>
          <span style={{fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: theme.accent}}>Défi de la semaine</span>
        </div>
        <div style={{fontFamily: fontDisplay, fontSize: 17, fontWeight: 700, marginBottom: 4}}>Visiter 3 nouveaux lieux culturels</div>
        <div style={{fontSize: 12, color: theme.textDim}}>Récompense : +100 XP bonus</div>
      </div>

      {/* 📄 INFORMATIONS LÉGALES */}
      <button onClick={onShowLegal} style={{
        width: '100%', marginTop: 20,
        background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: 16, padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer', fontFamily: 'inherit', color: theme.text, textAlign: 'left',
      }}>
        <FileText size={20} color={theme.accent}/>
        <div style={{flex: 1}}>
          <div style={{fontSize: 14, fontWeight: 700}}>Informations légales</div>
          <div style={{fontSize: 11, color: theme.textDim, marginTop: 2}}>Mentions légales, CGU et confidentialité</div>
        </div>
        <ChevronRight size={18} color={theme.textDim}/>
      </button>

      {/* À propos */}
      <div style={{
        marginTop: 14, textAlign: 'center', fontSize: 11,
        color: theme.textDim, lineHeight: 1.6,
      }}>
        <div style={{fontWeight: 700, color: theme.text, marginBottom: 4}}>PérigueuxAccess · v1.0</div>
        <div>Application citoyenne d'accessibilité à Périgueux</div>
        <div>Faite avec ❤️ pour tous les Périgourdins</div>
      </div>
    </div>
  );
}

// ======================================================
// 🩸 VUE DIABÈTE — Section dédiée aux personnes diabétiques
// ======================================================
function DiabeteView({ theme, fontDisplay, places, userLocation, onRequestLocation, locationStatus, onSelectPlace, onDirections, profile, onTriggerSOS, onAddGlycemie, onDeleteGlycemie }) {
  const [tab, setTab] = useState('sucre'); // sucre | medecins | labo | carnet
  const [category, setCategory] = useState('all');
  const pink = '#E91E63';

  return (
    <div style={{paddingBottom: 20}}>
      {/* Hero rose */}
      <div style={{
        background: `linear-gradient(135deg, ${pink} 0%, #AD1457 100%)`,
        padding: '20px 20px 20px', color: '#fff',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
          <div style={{fontSize: 36}}>🩸</div>
          <div style={{flex: 1}}>
            <div style={{fontFamily: fontDisplay, fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1}}>
              Espace Diabète
            </div>
            <div style={{fontSize: 12, opacity: 0.9, marginTop: 3}}>
              Votre assistant au quotidien
            </div>
          </div>
        </div>

        {/* 🚨 GROS BOUTON SOS */}
        <button onClick={onTriggerSOS} aria-label="Déclencher l'alerte hypoglycémie" style={{
          width: '100%', background: '#fff', color: pink,
          border: '3px solid #fff', borderRadius: 18, padding: '18px 16px',
          fontSize: 18, fontWeight: 900, fontFamily: 'inherit', letterSpacing: '0.02em',
          cursor: 'pointer', display:'flex',alignItems:'center',justifyContent:'center',gap: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          animation: 'popIn 0.4s ease',
        }}>
          <span style={{fontSize: 28}}>🚨</span>
          <span>SOS HYPOGLYCÉMIE</span>
        </button>
        <div style={{fontSize: 11, textAlign: 'center', marginTop: 8, opacity: 0.85}}>
          Un clic en cas d'urgence — affiche le lieu le plus proche
        </div>
      </div>

      {/* Onglets */}
      <div style={{
        display:'flex', background: theme.surface, borderBottom: `1px solid ${theme.border}`,
        position: 'sticky', top: 68, zIndex: 50, overflowX: 'auto',
      }}>
        {[
          { id: 'sucre', label: '🍬 Sucre', count: places.filter(p=>p.type==='sucre').length },
          { id: 'medecins', label: '👨‍⚕️ Médecins', count: places.filter(p=>p.type==='diabetologue').length },
          { id: 'labo', label: '🔬 Labos', count: places.filter(p=>p.type==='laboratoire').length },
          { id: 'carnet', label: '💉 Carnet', count: profile.glycemies.length },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, minWidth: 80,
            background: 'transparent', border: 'none',
            borderBottom: `3px solid ${tab === t.id ? pink : 'transparent'}`,
            padding: '14px 8px', fontSize: 12, fontWeight: 700,
            color: tab === t.id ? pink : theme.textDim, cursor: 'pointer',
            fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}>
            {t.label} <span style={{
              background: tab === t.id ? pink : theme.surfaceAlt,
              color: tab === t.id ? '#fff' : theme.textDim,
              fontSize: 10, padding: '1px 6px', borderRadius: 8, marginLeft: 2,
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Contenu selon onglet */}
      <div style={{padding: '18px 20px 0'}}>
        {tab === 'sucre' && <SucreTab theme={theme} fontDisplay={fontDisplay} places={places} userLocation={userLocation} onRequestLocation={onRequestLocation} locationStatus={locationStatus} onSelectPlace={onSelectPlace} onDirections={onDirections} category={category} setCategory={setCategory} pink={pink} />}

        {tab === 'medecins' && <MedecinsTab theme={theme} fontDisplay={fontDisplay} places={places} userLocation={userLocation} onSelectPlace={onSelectPlace} onDirections={onDirections} pink={pink} />}

        {tab === 'labo' && <LaboTab theme={theme} fontDisplay={fontDisplay} places={places} userLocation={userLocation} onSelectPlace={onSelectPlace} onDirections={onDirections} pink={pink} />}

        {tab === 'carnet' && <CarnetTab theme={theme} fontDisplay={fontDisplay} profile={profile} onAddGlycemie={onAddGlycemie} onDeleteGlycemie={onDeleteGlycemie} pink={pink} />}
      </div>
    </div>
  );
}

// --- ONGLET SUCRE ---
function SucreTab({ theme, fontDisplay, places, userLocation, onRequestLocation, locationStatus, onSelectPlace, onDirections, category, setCategory, pink }) {
  const sugarPlaces = useMemo(() => {
    let list = places.filter(p => p.type === 'sucre');
    if (category !== 'all') {
      const emojiMap = { pharmacie: '💊', boulangerie: '🥐', supermarche: '🛒', tabac: '🚬', station: '⛽' };
      list = list.filter(p => p.name.startsWith(emojiMap[category]));
    }
    if (userLocation) {
      list = [...list].sort((a, b) =>
        haversine(userLocation.lat, userLocation.lng, a.lat, a.lng) -
        haversine(userLocation.lat, userLocation.lng, b.lat, b.lng)
      );
    }
    return list;
  }, [places, userLocation, category]);

  return (
    <div>
      {/* Infos hypoglycémie */}
      <div style={{
        background: theme.surface, border: `2px solid ${pink}`,
        borderRadius: 16, padding: 14, marginBottom: 18,
      }}>
        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
          <span style={{fontSize: 18}}>⚠️</span>
          <span style={{fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: pink}}>
            En cas d'hypoglycémie
          </span>
        </div>
        <div style={{fontSize: 13, lineHeight: 1.5, color: theme.text}}>
          <div style={{marginBottom: 6}}><strong>15 g de sucre rapide</strong>, c'est :</div>
          <div style={{paddingLeft: 12}}>
            • 3 morceaux de sucre n°4<br/>
            • 15 cl de jus de fruit ou de soda (non light)<br/>
            • 1 cuillère à soupe de miel ou confiture<br/>
            • 3 bonbons type fruits durs<br/>
            • 1 gel de glucose (pharmacie)
          </div>
        </div>
      </div>

      {!userLocation && (
        <button onClick={onRequestLocation} style={{
          width: '100%', background: theme.surface, color: pink,
          border: `2px solid ${pink}`, borderRadius: 12, padding: 12,
          fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 14,
          fontFamily: 'inherit', display:'flex',alignItems:'center',justifyContent:'center',gap: 6,
        }}>
          <Locate size={16}/> {locationStatus === 'loading' ? 'Localisation…' : 'Activer ma position pour trier par distance'}
        </button>
      )}

      <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom: 4, marginBottom: 14}}>
        {[
          { id: 'all', icon: '✨', label: 'Tous' },
          { id: 'pharmacie', icon: '💊', label: 'Pharmacies' },
          { id: 'boulangerie', icon: '🥐', label: 'Boulangeries' },
          { id: 'supermarche', icon: '🛒', label: 'Supérettes' },
          { id: 'tabac', icon: '🚬', label: 'Tabacs' },
          { id: 'station', icon: '⛽', label: 'Stations' },
        ].map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)} style={{
            background: category === cat.id ? pink : theme.surface,
            color: category === cat.id ? '#fff' : theme.text,
            border: `1px solid ${category === cat.id ? pink : theme.border}`,
            borderRadius: 20, padding: '7px 12px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}>
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {sugarPlaces.map((p, i) => {
          const dist = userLocation ? haversine(userLocation.lat, userLocation.lng, p.lat, p.lng) : null;
          const is24h = (p.hours || '').includes('24h/24');
          const openSunday = (p.hours || '').toLowerCase().includes('7j/7') || (p.hours || '').toLowerCase().includes('dim');
          return (
            <DiabeteCard key={p.id} place={p} theme={theme} fontDisplay={fontDisplay} dist={dist} onSelectPlace={onSelectPlace} onDirections={onDirections} pink={pink}
              badges={[
                is24h && { color: pink, text: '24H/24' },
                openSunday && !is24h && { color: theme.success, text: '7J/7' },
              ].filter(Boolean)}
              featured={i === 0 && userLocation}
            />
          );
        })}
      </div>

      <div style={{
        marginTop: 20, padding: 14, background: theme.surfaceAlt,
        borderRadius: 12, fontSize: 11, color: theme.textDim, lineHeight: 1.6,
      }}>
        <strong style={{color: theme.text}}>💡 Conseil :</strong> Gardez toujours sur vous 3 morceaux de sucre ou un gel de glucose.
        <div style={{marginTop: 8}}>
          📞 <strong>Urgence grave :</strong> 15 (SAMU) ou 112<br/>
          📞 <strong>Pharmacie de garde :</strong> 3237
        </div>
      </div>
    </div>
  );
}

// --- ONGLET MÉDECINS ---
function MedecinsTab({ theme, fontDisplay, places, userLocation, onSelectPlace, onDirections, pink }) {
  const medecins = useMemo(() => {
    let list = places.filter(p => p.type === 'diabetologue');
    if (userLocation) {
      list = [...list].sort((a, b) =>
        haversine(userLocation.lat, userLocation.lng, a.lat, a.lng) -
        haversine(userLocation.lat, userLocation.lng, b.lat, b.lng)
      );
    }
    return list;
  }, [places, userLocation]);

  return (
    <div>
      <div style={{
        background: '#9C27B0', color: '#fff', borderRadius: 16, padding: 14, marginBottom: 16,
      }}>
        <div style={{fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4, opacity: 0.9}}>
          👨‍⚕️ Suivi médical
        </div>
        <div style={{fontSize: 13, lineHeight: 1.5}}>
          Un suivi régulier par un diabétologue est essentiel. Consultation tous les 3 à 6 mois recommandée pour ajuster le traitement.
        </div>
      </div>

      <a href="https://www.doctolib.fr/endocrinologue/perigueux" target="_blank" rel="noopener noreferrer" style={{
        display: 'block', background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: 12, padding: 12, marginBottom: 14, textDecoration: 'none',
        color: theme.text, fontSize: 13,
      }}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{fontSize: 28}}>📅</div>
          <div style={{flex: 1}}>
            <div style={{fontWeight: 700, marginBottom: 2}}>Prendre RDV en ligne</div>
            <div style={{fontSize: 11, color: theme.textDim}}>Doctolib — tous les diabétologues de Périgueux</div>
          </div>
          <ChevronRight size={18} color={theme.textDim}/>
        </div>
      </a>

      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {medecins.map((p, i) => {
          const dist = userLocation ? haversine(userLocation.lat, userLocation.lng, p.lat, p.lng) : null;
          return (
            <DiabeteCard key={p.id} place={p} theme={theme} fontDisplay={fontDisplay} dist={dist} onSelectPlace={onSelectPlace} onDirections={onDirections} pink="#9C27B0" />
          );
        })}
      </div>
    </div>
  );
}

// --- ONGLET LABORATOIRES ---
function LaboTab({ theme, fontDisplay, places, userLocation, onSelectPlace, onDirections, pink }) {
  const labos = useMemo(() => {
    let list = places.filter(p => p.type === 'laboratoire');
    if (userLocation) {
      list = [...list].sort((a, b) =>
        haversine(userLocation.lat, userLocation.lng, a.lat, a.lng) -
        haversine(userLocation.lat, userLocation.lng, b.lat, b.lng)
      );
    }
    return list;
  }, [places, userLocation]);

  return (
    <div>
      <div style={{
        background: '#00ACC1', color: '#fff', borderRadius: 16, padding: 14, marginBottom: 16,
      }}>
        <div style={{fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4, opacity: 0.9}}>
          🔬 Analyses recommandées
        </div>
        <div style={{fontSize: 13, lineHeight: 1.5}}>
          <strong>HbA1c</strong> : tous les 3 mois (reflet de la glycémie moyenne)<br/>
          <strong>Glycémie à jeun</strong> : selon prescription<br/>
          <strong>Micro-albuminurie</strong> : 1 fois/an (fonction rénale)
        </div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {labos.map((p, i) => {
          const dist = userLocation ? haversine(userLocation.lat, userLocation.lng, p.lat, p.lng) : null;
          return (
            <DiabeteCard key={p.id} place={p} theme={theme} fontDisplay={fontDisplay} dist={dist} onSelectPlace={onSelectPlace} onDirections={onDirections} pink="#00ACC1"
              badges={(p.hours || '').includes('24h/24') ? [{color: '#00ACC1', text: '24H/24'}] : []}
            />
          );
        })}
      </div>
    </div>
  );
}

// --- ONGLET CARNET DE GLYCÉMIE ---
function CarnetTab({ theme, fontDisplay, profile, onAddGlycemie, onDeleteGlycemie, pink }) {
  const [showForm, setShowForm] = useState(false);
  const [value, setValue] = useState('');
  const [moment, setMoment] = useState('avant_repas');
  const [note, setNote] = useState('');

  const MOMENTS = {
    jeun: { label: 'À jeun', icon: '🌅', target: '0.70-1.10' },
    avant_repas: { label: 'Avant repas', icon: '🍽️', target: '0.70-1.30' },
    apres_repas: { label: '2h après repas', icon: '⏱️', target: '< 1.80' },
    coucher: { label: 'Au coucher', icon: '🌙', target: '1.00-1.40' },
    nuit: { label: 'La nuit', icon: '😴', target: '> 0.80' },
  };

  const submit = () => {
    const v = parseFloat(value.replace(',', '.'));
    if (isNaN(v) || v <= 0 || v > 10) {
      window.alert('Valeur invalide (entre 0.1 et 10 g/L)');
      return;
    }
    onAddGlycemie(v, moment, note);
    setValue(''); setNote(''); setShowForm(false);
  };

  // Stats rapides
  const last7 = profile.glycemies.filter(g => {
    const d = new Date(g.date);
    return (Date.now() - d.getTime()) < 7 * 24 * 3600 * 1000;
  });
  const avg7 = last7.length > 0 ? (last7.reduce((s, g) => s + g.value, 0) / last7.length).toFixed(2) : '—';

  // Couleur selon valeur
  const colorFor = (v) => {
    if (v < 0.70) return pink; // hypo
    if (v > 1.80) return '#FF6D00'; // hyper
    return '#4CAF50'; // normal
  };

  return (
    <div>
      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8, marginBottom: 16,
      }}>
        <div style={{background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 12, textAlign: 'center'}}>
          <div style={{fontFamily: fontDisplay, fontSize: 22, fontWeight: 800, color: pink}}>{profile.glycemies.length}</div>
          <div style={{fontSize: 10, color: theme.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2}}>Mesures</div>
        </div>
        <div style={{background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 12, textAlign: 'center'}}>
          <div style={{fontFamily: fontDisplay, fontSize: 22, fontWeight: 800, color: pink}}>{avg7}</div>
          <div style={{fontSize: 10, color: theme.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2}}>Moy. 7j</div>
        </div>
        <div style={{background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 12, textAlign: 'center'}}>
          <div style={{fontFamily: fontDisplay, fontSize: 22, fontWeight: 800, color: pink}}>{last7.length}</div>
          <div style={{fontSize: 10, color: theme.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2}}>Sur 7j</div>
        </div>
      </div>

      {/* Bouton ajouter */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)} style={{
          width: '100%', background: pink, color: '#fff',
          border: 'none', borderRadius: 14, padding: 14,
          fontSize: 15, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'inherit', display:'flex',alignItems:'center',justifyContent:'center',gap:8,
          marginBottom: 16,
        }}>
          <Plus size={18}/> Enregistrer une mesure
        </button>
      ) : (
        <div style={{
          background: theme.surface, border: `2px solid ${pink}`,
          borderRadius: 16, padding: 16, marginBottom: 16,
        }}>
          <div style={{fontFamily: fontDisplay, fontSize: 17, fontWeight: 700, marginBottom: 12}}>
            Nouvelle mesure
          </div>

          {/* Valeur */}
          <div style={{marginBottom: 14}}>
            <div style={{fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textDim, marginBottom: 6}}>
              Glycémie (g/L)
            </div>
            <input type="text" inputMode="decimal" value={value} onChange={e => setValue(e.target.value)}
              placeholder="Ex : 1.20" style={{
                width: '100%', background: theme.surfaceAlt, border: `1px solid ${theme.border}`,
                borderRadius: 12, padding: '14px 16px', color: theme.text,
                fontSize: 28, fontFamily: 'inherit', fontWeight: 700, outline: 'none',
                textAlign: 'center',
              }}/>
            <div style={{fontSize: 11, color: theme.textDim, marginTop: 4, textAlign: 'center'}}>
              (normale : 0.70 à 1.10 g/L à jeun)
            </div>
          </div>

          {/* Moment */}
          <div style={{marginBottom: 14}}>
            <div style={{fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textDim, marginBottom: 6}}>
              Moment
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap: 6}}>
              {Object.entries(MOMENTS).map(([key, cfg]) => (
                <button key={key} onClick={() => setMoment(key)} style={{
                  background: moment === key ? pink : theme.surfaceAlt,
                  color: moment === key ? '#fff' : theme.text,
                  border: `1px solid ${moment === key ? pink : theme.border}`,
                  borderRadius: 10, padding: '10px 8px', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span>{cfg.icon}</span> {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note optionnelle */}
          <div style={{marginBottom: 14}}>
            <div style={{fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textDim, marginBottom: 6}}>
              Note (facultatif)
            </div>
            <input type="text" value={note} onChange={e => setNote(e.target.value)}
              placeholder="Ex : après 30 min de marche"
              style={{
                width: '100%', background: theme.surfaceAlt, border: `1px solid ${theme.border}`,
                borderRadius: 10, padding: 10, color: theme.text, fontSize: 13,
                fontFamily: 'inherit', outline: 'none',
              }}/>
          </div>

          <div style={{display:'flex',gap:8}}>
            <button onClick={() => { setShowForm(false); setValue(''); setNote(''); }} style={{
              flex: 1, background: theme.surfaceAlt, color: theme.text,
              border: `1px solid ${theme.border}`, borderRadius: 10, padding: 12,
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>Annuler</button>
            <button onClick={submit} style={{
              flex: 2, background: pink, color: '#fff',
              border: 'none', borderRadius: 10, padding: 12,
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>💉 Enregistrer</button>
          </div>
        </div>
      )}

      {/* Liste des mesures */}
      {profile.glycemies.length === 0 ? (
        <div style={{textAlign:'center',padding: 40, color: theme.textDim, fontSize: 13}}>
          <div style={{fontSize: 48, marginBottom: 10, opacity: 0.5}}>💉</div>
          Aucune mesure enregistrée.<br/>
          Cliquez sur le bouton ci-dessus pour commencer votre carnet.
        </div>
      ) : (
        <div>
          <div style={{fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textDim, marginBottom: 10}}>
            Historique ({profile.glycemies.length})
          </div>
          <div style={{display:'flex',flexDirection:'column',gap: 8}}>
            {profile.glycemies.slice(0, 30).map(g => {
              const d = new Date(g.date);
              const dateStr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
              const timeStr = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
              const m = MOMENTS[g.moment] || { label: g.moment, icon: '📍' };
              const color = colorFor(g.value);
              return (
                <div key={g.id} style={{
                  background: theme.surface, border: `1px solid ${theme.border}`,
                  borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    background: color, color: '#fff', borderRadius: 12,
                    padding: '10px 12px', minWidth: 72, textAlign: 'center',
                  }}>
                    <div style={{fontFamily: fontDisplay, fontSize: 22, fontWeight: 800, lineHeight: 1}}>
                      {g.value.toFixed(2)}
                    </div>
                    <div style={{fontSize: 9, marginTop: 2, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.1em'}}>
                      g/L
                    </div>
                  </div>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{fontSize: 13, fontWeight: 700, marginBottom: 2}}>
                      {m.icon} {m.label}
                    </div>
                    <div style={{fontSize: 11, color: theme.textDim}}>
                      {dateStr} à {timeStr}
                    </div>
                    {g.note && <div style={{fontSize: 11, color: theme.textDim, fontStyle: 'italic', marginTop: 3, whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>« {g.note} »</div>}
                  </div>
                  <button onClick={() => { if (window.confirm('Supprimer cette mesure ?')) onDeleteGlycemie(g.id); }}
                    aria-label="Supprimer" style={{
                      background: 'none', border: 'none', color: theme.textDim,
                      cursor: 'pointer', padding: 6,
                    }}>
                    <X size={16}/>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{
        marginTop: 20, padding: 12, background: theme.surfaceAlt,
        borderRadius: 12, fontSize: 11, color: theme.textDim, lineHeight: 1.5,
      }}>
        ℹ️ Les mesures sont enregistrées sur votre appareil uniquement. Pensez à partager vos résultats avec votre médecin lors des consultations.
      </div>
    </div>
  );
}

// --- CARTE RÉUTILISABLE POUR LES ONGLETS DIABÈTE ---
function DiabeteCard({ place, theme, fontDisplay, dist, onSelectPlace, onDirections, pink, badges = [], featured }) {
  return (
    <div style={{
      background: theme.surface, border: `${featured ? 2 : 1}px solid ${featured ? pink : theme.border}`,
      borderRadius: 14, padding: 14, position: 'relative',
    }}>
      {featured && (
        <div style={{
          position: 'absolute', top: -9, left: 12,
          background: pink, color: '#fff', padding: '3px 9px',
          fontSize: 9, fontWeight: 800, borderRadius: 4, letterSpacing: '0.1em',
        }}>LE + PROCHE</div>
      )}
      <div style={{fontFamily: fontDisplay, fontSize: 16, fontWeight: 700, lineHeight: 1.2, marginBottom: 4}}>
        {place.name}
      </div>
      <div style={{fontSize: 12, color: theme.textDim, marginBottom: 6}}>
        📍 {place.address}
      </div>
      {place.description && (
        <div style={{fontSize: 12, color: theme.textDim, lineHeight: 1.4, marginBottom: 8, fontStyle: 'italic'}}>
          {place.description}
        </div>
      )}
      <div style={{display:'flex',flexWrap:'wrap',gap: 4, marginBottom: 10}}>
        <span style={{fontSize: 11, padding: '3px 8px', background: theme.surfaceAlt, borderRadius: 10, fontWeight: 600}}>
          🕐 {place.hours}
        </span>
        {badges.map((b, i) => (
          <span key={i} style={{fontSize: 11, padding: '3px 8px', background: b.color, color: '#fff', borderRadius: 10, fontWeight: 700}}>
            {b.text}
          </span>
        ))}
        {dist !== null && dist !== undefined && (
          <span style={{fontSize: 11, padding: '3px 8px', background: theme.accent, color: '#fff', borderRadius: 10, fontWeight: 700}}>
            📍 {dist < 1 ? `${Math.round(dist*1000)}m` : `${dist.toFixed(1)}km`}
          </span>
        )}
      </div>
      <div style={{display:'grid',gridTemplateColumns: place.phone ? '1fr 1fr 1fr' : '1fr 1fr', gap: 6}}>
        <button onClick={() => onSelectPlace(place)} style={{
          background: theme.surfaceAlt, color: theme.text,
          border: `1px solid ${theme.border}`, borderRadius: 10,
          padding: '8px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'inherit',
        }}>Détails</button>
        <button onClick={() => onDirections(place)} style={{
          background: pink, color: '#fff',
          border: 'none', borderRadius: 10,
          padding: '8px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'inherit', display:'flex',alignItems:'center',justifyContent:'center',gap:4,
        }}>
          <Route size={14}/> Y aller
        </button>
        {place.phone && (
          <a href={`tel:${place.phone.replace(/\s/g, '')}`} style={{
            background: '#4CAF50', color: '#fff',
            border: 'none', borderRadius: 10,
            padding: '8px', fontSize: 11, fontWeight: 700,
            textDecoration: 'none', fontFamily: 'inherit',
            display:'flex',alignItems:'center',justifyContent:'center',gap:4,
          }}>
            <Phone size={14}/> Appeler
          </a>
        )}
      </div>
    </div>
  );
}

// ======================================================
// 📄 VUE INFORMATIONS LÉGALES (Mentions + CGU + Confidentialité)
// ======================================================
function LegalView({ theme, fontDisplay, onBack }) {
  const [section, setSection] = useState('mentions'); // mentions | cgu | confidentialite

  const Section = ({ title, children }) => (
    <div style={{marginBottom: 18}}>
      <h3 style={{
        fontFamily: fontDisplay, fontSize: 17, fontWeight: 700,
        letterSpacing: '-0.01em', margin: '0 0 8px', color: theme.accent,
      }}>{title}</h3>
      <div style={{fontSize: 13, lineHeight: 1.6, color: theme.text}}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{paddingBottom: 30}}>
      {/* Header */}
      <div style={{
        background: theme.surface, borderBottom: `1px solid ${theme.border}`,
        padding: '14px 20px', position: 'sticky', top: 68, zIndex: 50,
      }}>
        <button onClick={onBack} style={{
          background: theme.surfaceAlt, border: `1px solid ${theme.border}`, borderRadius: 10,
          padding: '8px 14px', color: theme.text, cursor: 'pointer',
          fontSize: 13, fontFamily: 'inherit', display:'flex',alignItems:'center',gap:4,
          marginBottom: 12,
        }}>← Retour au profil</button>
        <h1 style={{fontFamily: fontDisplay, fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 4px'}}>
          Informations légales
        </h1>
        <div style={{fontSize: 12, color: theme.textDim}}>
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Onglets */}
      <div style={{display:'flex', background: theme.surfaceAlt, borderBottom: `1px solid ${theme.border}`}}>
        {[
          { id: 'mentions', label: '📋 Mentions légales' },
          { id: 'cgu', label: '📜 CGU' },
          { id: 'confidentialite', label: '🔒 Confidentialité' },
        ].map(t => (
          <button key={t.id} onClick={() => setSection(t.id)} style={{
            flex: 1, background: 'transparent', border: 'none',
            borderBottom: `3px solid ${section === t.id ? theme.accent : 'transparent'}`,
            padding: '12px 6px', fontSize: 12, fontWeight: 700,
            color: section === t.id ? theme.accent : theme.textDim, cursor: 'pointer',
            fontFamily: 'inherit',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{padding: '20px'}}>
        {/* ============================================================ */}
        {/* MENTIONS LÉGALES                                             */}
        {/* ============================================================ */}
        {section === 'mentions' && (
          <div>
            <Section title="Éditeur de l'application">
              <p><strong>PérigueuxAccess</strong> est édité par :</p>
              <p>
                [Votre Prénom NOM]<br/>
                Créateur indépendant<br/>
                [Votre adresse postale]<br/>
                24000 Périgueux, France<br/>
                Email : <a href="mailto:perigueux.access@gmail.com" style={{color: theme.accent}}>perigueux.access@gmail.com</a>
              </p>
              <p style={{fontSize: 12, color: theme.textDim, marginTop: 8}}>
                ⚠️ À compléter : remplacez les crochets par vos vraies coordonnées avant publication. Si l'activité devient commerciale, créez une micro-entreprise et ajoutez le numéro SIRET.
              </p>
            </Section>

            <Section title="Directeur de la publication">
              <p>[Votre Prénom NOM], créateur et éditeur du service.</p>
            </Section>

            <Section title="Hébergeur du site">
              <p>
                <strong>[À compléter selon votre hébergeur]</strong><br/>
                Par exemple :<br/>
                OVH SAS — 2 rue Kellermann, 59100 Roubaix, France — ovh.com<br/>
                ou Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, USA — vercel.com
              </p>
            </Section>

            <Section title="Propriété intellectuelle">
              <p>
                L'ensemble du contenu de l'application (textes, code source, design, logo, base de données) est la propriété exclusive de <strong>PérigueuxAccess</strong> et protégé par le droit d'auteur français (Code de la propriété intellectuelle).
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments de l'application, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable.
              </p>
              <p>
                Les données d'accessibilité proviennent de sources ouvertes : plateforme Acceslibre (beta.gouv.fr, licence Etalab 2.0), Ville de Périgueux, Office de Tourisme du Grand Périgueux.
              </p>
            </Section>

            <Section title="Litiges et droit applicable">
              <p>
                Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
              </p>
              <p>
                Pour toute question, contactez : <a href="mailto:perigueux.access@gmail.com" style={{color: theme.accent}}>perigueux.access@gmail.com</a>
              </p>
            </Section>

            <Section title="Signalement de contenu">
              <p>
                Pour signaler un contenu illicite, une information erronée ou un lieu à vérifier, contactez-nous par email. Nous répondons sous 7 jours ouvrés.
              </p>
            </Section>

            <Section title="Crédits">
              <p>
                Cartographie : OpenStreetMap & CARTO<br/>
                Icônes : Lucide React<br/>
                Polices : Fraunces & Inter (Google Fonts)<br/>
                Données accessibilité : Acceslibre (beta.gouv.fr)
              </p>
            </Section>
          </div>
        )}

        {/* ============================================================ */}
        {/* CGU                                                          */}
        {/* ============================================================ */}
        {section === 'cgu' && (
          <div>
            <div style={{
              background: theme.surface, border: `2px solid ${theme.accent}`,
              borderRadius: 12, padding: 12, marginBottom: 18, fontSize: 12, lineHeight: 1.5,
            }}>
              ℹ️ En utilisant PérigueuxAccess, vous acceptez les présentes conditions. Lisez-les attentivement.
            </div>

            <Section title="Article 1 — Objet">
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation de l'application <strong>PérigueuxAccess</strong>, service gratuit et collaboratif cartographiant l'accessibilité des lieux à Périgueux (Dordogne, France).
              </p>
            </Section>

            <Section title="Article 2 — Accès au service">
              <p>
                L'application est accessible gratuitement à toute personne disposant d'un accès à Internet. Aucune inscription n'est requise pour consulter les informations. Un pseudo local est utilisé pour la gamification (XP, badges, classement).
              </p>
              <p>
                L'éditeur se réserve le droit de suspendre temporairement l'application pour maintenance, sans que cela puisse engager sa responsabilité.
              </p>
            </Section>

            <Section title="Article 3 — Gratuité">
              <p>
                PérigueuxAccess est et restera gratuite pour les utilisateurs finaux. L'application ne contient <strong>aucune publicité</strong> et ne vend <strong>aucune donnée</strong>.
              </p>
            </Section>

            <Section title="Article 4 — ⚠️ AVERTISSEMENT SUR LES INFORMATIONS">
              <div style={{
                background: '#FFF3E0', color: '#E65100', padding: 12,
                borderRadius: 10, marginBottom: 10, fontSize: 12, lineHeight: 1.5,
                border: '1px solid #E65100',
              }}>
                <strong>Les informations fournies par PérigueuxAccess sont données à titre indicatif.</strong>
                Elles peuvent être incomplètes, obsolètes ou erronées. L'utilisateur est invité à <strong>vérifier directement auprès de l'établissement</strong> avant tout déplacement.
              </div>
              <p>
                En particulier, les informations d'accessibilité (rampes, toilettes PMR, horaires) peuvent évoluer sans que l'application soit immédiatement à jour. L'éditeur décline toute responsabilité en cas d'information incorrecte ayant entraîné un déplacement inutile.
              </p>
            </Section>

            <Section title="Article 5 — 🩸 AVERTISSEMENT MÉDICAL IMPORTANT">
              <div style={{
                background: '#FFEBEE', color: '#B71C1C', padding: 12,
                borderRadius: 10, marginBottom: 10, fontSize: 12, lineHeight: 1.5,
                border: '2px solid #B71C1C',
              }}>
                <strong>PérigueuxAccess n'est PAS un outil médical.</strong>
                <br/><br/>
                Les informations de la section "Espace Diabète" (conseils hypoglycémie, liste de médecins, carnet de glycémie) sont fournies à titre informatif uniquement. Elles ne remplacent en aucun cas l'avis d'un professionnel de santé.
                <br/><br/>
                <strong>En cas d'urgence médicale, composez immédiatement le 15 (SAMU) ou le 112 (urgences européennes).</strong>
                <br/><br/>
                Le carnet de glycémie est un outil de suivi personnel et ne constitue pas un dossier médical officiel. Partagez toujours vos résultats avec votre médecin traitant ou votre diabétologue.
              </div>
              <p>
                L'éditeur ne peut être tenu responsable d'un quelconque préjudice médical résultant de l'utilisation de l'application.
              </p>
            </Section>

            <Section title="Article 6 — Contributions des utilisateurs">
              <p>
                Les utilisateurs peuvent proposer l'ajout de lieux, publier des avis et télécharger des photos. En contribuant, l'utilisateur :
              </p>
              <ul style={{paddingLeft: 20, margin: '8px 0'}}>
                <li>garantit détenir les droits sur le contenu qu'il publie (texte, photos) ;</li>
                <li>accepte que son contenu soit visible publiquement ;</li>
                <li>accorde à PérigueuxAccess une licence non exclusive pour utiliser, afficher et partager ce contenu ;</li>
                <li>s'engage à ne pas publier de contenu injurieux, discriminatoire, diffamatoire, faux ou illégal.</li>
              </ul>
              <p>
                L'éditeur se réserve le droit de supprimer sans préavis tout contenu contraire aux présentes CGU ou à la loi.
              </p>
            </Section>

            <Section title="Article 7 — Géolocalisation">
              <p>
                La fonction de géolocalisation nécessite votre autorisation explicite. Elle n'est utilisée que pour :
              </p>
              <ul style={{paddingLeft: 20, margin: '8px 0'}}>
                <li>centrer la carte sur votre position ;</li>
                <li>calculer la distance vers les lieux ;</li>
                <li>trier les lieux par proximité.</li>
              </ul>
              <p>
                <strong>Votre position n'est jamais enregistrée</strong> ni transmise à des tiers.
              </p>
            </Section>

            <Section title="Article 8 — Responsabilité">
              <p>
                L'éditeur met en œuvre tous les moyens raisonnables pour assurer le bon fonctionnement de l'application. Il ne peut toutefois garantir une disponibilité continue ni l'exactitude absolue des informations.
              </p>
              <p>
                L'éditeur ne saurait être tenu responsable :
              </p>
              <ul style={{paddingLeft: 20, margin: '8px 0'}}>
                <li>des erreurs ou omissions dans les informations fournies ;</li>
                <li>des conséquences liées à un déplacement basé sur des informations de l'application ;</li>
                <li>des dommages directs ou indirects résultant de l'usage de l'application ;</li>
                <li>des interruptions de service, bugs ou perte de données.</li>
              </ul>
            </Section>

            <Section title="Article 9 — Propriété intellectuelle">
              <p>
                L'ensemble des éléments de l'application (code, design, textes, logos, base de données) est protégé par le droit d'auteur. Toute reproduction ou utilisation sans autorisation est interdite.
              </p>
            </Section>

            <Section title="Article 10 — Évolution des CGU">
              <p>
                Les présentes CGU peuvent être modifiées à tout moment. La date de dernière mise à jour est indiquée en haut de cette page. L'utilisation continue de l'application vaut acceptation des nouvelles conditions.
              </p>
            </Section>

            <Section title="Article 11 — Droit applicable">
              <p>
                Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents, sauf disposition légale contraire.
              </p>
            </Section>
          </div>
        )}

        {/* ============================================================ */}
        {/* POLITIQUE DE CONFIDENTIALITÉ (RGPD)                          */}
        {/* ============================================================ */}
        {section === 'confidentialite' && (
          <div>
            <div style={{
              background: theme.surface, border: `2px solid ${theme.success}`,
              borderRadius: 12, padding: 12, marginBottom: 18, fontSize: 12, lineHeight: 1.5,
            }}>
              🔒 <strong>Votre vie privée est notre priorité.</strong> PérigueuxAccess applique strictement le Règlement Général sur la Protection des Données (RGPD).
            </div>

            <Section title="Données collectées">
              <p>PérigueuxAccess collecte <strong>un minimum de données</strong> :</p>
              <ul style={{paddingLeft: 20, margin: '8px 0'}}>
                <li><strong>Pseudo utilisateur</strong> : choisi librement, modifiable à tout moment</li>
                <li><strong>Progression (XP, badges, visites)</strong> : stockée localement sur votre appareil</li>
                <li><strong>Favoris et carnet de glycémie</strong> : stockés localement sur votre appareil uniquement</li>
                <li><strong>Avis et contributions publiées</strong> : visibles publiquement avec votre pseudo</li>
                <li><strong>Position géographique</strong> : utilisée en temps réel uniquement, jamais stockée</li>
              </ul>
              <p>
                <strong>Aucune donnée personnelle (nom réel, adresse, téléphone, email) n'est collectée</strong> tant que vous ne nous contactez pas volontairement.
              </p>
            </Section>

            <Section title="Stockage local">
              <p>
                La majorité de vos données (profil, favoris, carnet de glycémie, mesures) sont stockées <strong>uniquement sur votre appareil</strong> via le stockage local du navigateur. Elles ne sont jamais transmises à un serveur.
              </p>
              <p>
                Pour effacer ces données, videz le cache de votre navigateur ou utilisez la fonction de réinitialisation.
              </p>
            </Section>

            <Section title="Finalités">
              <p>Les données sont utilisées uniquement pour :</p>
              <ul style={{paddingLeft: 20, margin: '8px 0'}}>
                <li>Faire fonctionner l'application et ses fonctionnalités ;</li>
                <li>Personnaliser votre expérience (langue, thème, accessibilité) ;</li>
                <li>Afficher votre progression dans la gamification ;</li>
                <li>Répondre à vos demandes de contact.</li>
              </ul>
              <p>
                <strong>Vos données ne sont jamais vendues, louées ou transmises à des partenaires commerciaux.</strong>
              </p>
            </Section>

            <Section title="Cookies">
              <p>
                L'application utilise uniquement des <strong>cookies techniques</strong> nécessaires au fonctionnement (stockage de votre progression). Elle n'utilise <strong>aucun cookie publicitaire</strong> ni <strong>aucun traceur tiers</strong>.
              </p>
            </Section>

            <Section title="Services tiers utilisés">
              <p>L'application fait appel à quelques services tiers pour fonctionner :</p>
              <ul style={{paddingLeft: 20, margin: '8px 0'}}>
                <li><strong>OpenStreetMap & CARTO</strong> : cartographie (données de localisation anonymes)</li>
                <li><strong>ipapi.co</strong> : géolocalisation approximative par IP (uniquement en secours)</li>
                <li><strong>Google Fonts</strong> : polices de caractères</li>
              </ul>
              <p>
                Ces services ont leurs propres politiques de confidentialité que nous vous invitons à consulter.
              </p>
            </Section>

            <Section title="Vos droits (RGPD)">
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul style={{paddingLeft: 20, margin: '8px 0'}}>
                <li><strong>Droit d'accès</strong> : obtenir copie de vos données</li>
                <li><strong>Droit de rectification</strong> : corriger vos données inexactes</li>
                <li><strong>Droit à l'effacement</strong> : supprimer vos données</li>
                <li><strong>Droit d'opposition</strong> : refuser certains traitements</li>
                <li><strong>Droit à la portabilité</strong> : récupérer vos données dans un format lisible</li>
                <li><strong>Droit de réclamation</strong> : saisir la CNIL (cnil.fr)</li>
              </ul>
              <p>
                Pour exercer ces droits, contactez : <a href="mailto:perigueux.access@gmail.com" style={{color: theme.accent}}>perigueux.access@gmail.com</a>
              </p>
            </Section>

            <Section title="Sécurité">
              <p>
                Nous mettons en œuvre des mesures de sécurité raisonnables pour protéger vos données contre tout accès, modification ou divulgation non autorisés. Toutefois, aucune méthode de transmission sur Internet n'est totalement sécurisée.
              </p>
            </Section>

            <Section title="Protection des mineurs">
              <p>
                L'application est destinée à tous. Pour les utilisateurs de moins de 15 ans, nous recommandons l'accompagnement d'un parent ou tuteur légal.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                Pour toute question relative à la protection de vos données :<br/>
                📧 <a href="mailto:perigueux.access@gmail.com" style={{color: theme.accent}}>perigueux.access@gmail.com</a>
              </p>
              <p>
                Autorité de contrôle : Commission Nationale de l'Informatique et des Libertés (CNIL) — <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{color: theme.accent}}>cnil.fr</a>
              </p>
            </Section>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 30, padding: 16, background: theme.surfaceAlt,
          borderRadius: 12, textAlign: 'center', fontSize: 11, color: theme.textDim, lineHeight: 1.6,
        }}>
          <div style={{fontWeight: 700, color: theme.text, marginBottom: 4}}>
            PérigueuxAccess © {new Date().getFullYear()}
          </div>
          <div>Tous droits réservés</div>
          <div style={{marginTop: 8}}>
            📧 <a href="mailto:perigueux.access@gmail.com" style={{color: theme.accent}}>perigueux.access@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ theme, fontDisplay, value, label, icon }) {
  return (
    <div style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 14, padding: '14px 8px', textAlign: 'center',
    }}>
      <div style={{fontSize: 20, marginBottom: 4}}>{icon}</div>
      <div style={{fontFamily: fontDisplay, fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em'}}>{value}</div>
      <div style={{fontSize: 10, color: theme.textDim, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600}}>{label}</div>
    </div>
  );
}

// ======================================================
// CLASSEMENT
// ======================================================
function LeaderboardView({ theme, fontDisplay, profile, leaderboard, setLeaderboard }) {
  const [submitted, setSubmitted] = useState(false);

  const publishScore = async () => {
    try {
      const current = leaderboard.filter(e => e.name !== profile.name);
      const updated = [...current, { name: profile.name, xp: profile.xp, level: getLevel(profile.xp).name, date: Date.now() }]
        .sort((a,b)=>b.xp-a.xp).slice(0, 50);
      await window.storage.set('leaderboard', JSON.stringify(updated), true);
      setLeaderboard(updated);
      setSubmitted(true);
    } catch(e){}
  };

  const displayList = leaderboard.length > 0 ? leaderboard : [
    { name: 'Marie C.', xp: 1250, level: 'Légende de Périgueux' },
    { name: 'Thomas R.', xp: 840, level: 'Expert' },
    { name: 'Sophie L.', xp: 620, level: 'Expert' },
    { name: 'Julien B.', xp: 390, level: 'Ambassadeur' },
    { name: 'Claire M.', xp: 210, level: 'Ambassadeur' },
  ];

  return (
    <div style={{padding: '20px'}}>
      <div style={{textAlign:'center',marginBottom: 24}}>
        <Trophy size={48} color={theme.accent2} style={{marginBottom: 10}}/>
        <h2 style={{fontFamily: fontDisplay, fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 4px'}}>
          Top Explorateurs
        </h2>
        <div style={{fontSize: 13, color: theme.textDim}}>Les ambassadeurs de l'accessibilité à Périgueux</div>
      </div>

      <button onClick={publishScore} disabled={submitted} style={{
        width: '100%', background: submitted ? theme.surfaceAlt : theme.accent,
        color: submitted ? theme.textDim : '#fff',
        border: 'none', borderRadius: 12, padding: 12, fontSize: 13, fontWeight: 700,
        cursor: submitted ? 'default' : 'pointer', marginBottom: 20, fontFamily: 'inherit',
      }}>
        {submitted ? '✓ Score publié' : `Publier mon score (${profile.xp} XP) dans le classement public`}
      </button>

      <div style={{background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, overflow: 'hidden'}}>
        {displayList.map((e, i) => (
          <div key={i} style={{
            display:'flex',alignItems:'center',gap: 12, padding: '14px 16px',
            borderBottom: i < displayList.length-1 ? `1px solid ${theme.border}` : 'none',
            background: e.name === profile.name ? `${theme.accent}15` : 'transparent',
          }}>
            <div style={{
              fontFamily: fontDisplay, fontSize: 22, fontWeight: 800,
              width: 36, textAlign: 'center',
              color: i===0?'#D4A574':i===1?'#A8A8A8':i===2?'#CD7F32':theme.textDim,
            }}>
              {i<3 ? ['🥇','🥈','🥉'][i] : `#${i+1}`}
            </div>
            <div style={{flex: 1}}>
              <div style={{fontWeight: 700, fontSize: 15}}>{e.name}</div>
              <div style={{fontSize: 11, color: theme.textDim, letterSpacing: '0.05em'}}>{e.level}</div>
            </div>
            <div style={{
              fontFamily: fontDisplay, fontSize: 18, fontWeight: 800, color: theme.accent,
            }}>{e.xp}<span style={{fontSize: 10, color: theme.textDim, marginLeft: 3}}>XP</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ======================================================
// AJOUT D'UN LIEU
// ======================================================
function AddPlaceView({ theme, fontDisplay, onAdd, onCancel }) {
  const [form, setForm] = useState({
    name: '', type: 'restaurant', address: '', lat: 45.1846, lng: 0.7229,
    quartier: 'Centre', disabilities: ['moteur'], equipment: [],
    score: 3, hours: '', phone: '',
  });
  const [step, setStep] = useState(1);

  const toggle = (field, val) => {
    setForm({...form, [field]: form[field].includes(val) ? form[field].filter(x=>x!==val) : [...form[field], val]});
  };

  const submit = () => {
    if (!form.name || !form.name.trim()) return window.alert('Nom du lieu requis');
    if (!form.address || !form.address.trim()) return window.alert('Adresse requise');

    // Validation coordonnées (Périgueux ~45.18, 0.72 — rayon 50 km)
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (isNaN(lat) || isNaN(lng)) return window.alert('Coordonnées invalides');
    if (lat < 44.5 || lat > 45.8 || lng < 0 || lng > 1.5) {
      return window.alert('Les coordonnées semblent hors de Périgueux et ses environs. Vérifiez lat/lng.');
    }

    onAdd(form);
  };

  return (
    <div style={{padding: '20px'}}>
      <button onClick={onCancel} style={{
        background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 10,
        padding: '8px 14px', color: theme.text, cursor: 'pointer', marginBottom: 16,
        fontSize: 13, fontFamily: 'inherit',
      }}>← Annuler</button>

      <h2 style={{fontFamily: fontDisplay, fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 4px'}}>
        Partager un lieu accessible
      </h2>
      <div style={{fontSize: 13, color: theme.textDim, marginBottom: 20}}>Étape {step}/3 — Aidez la communauté</div>

      {step === 1 && (
        <div>
          <Field label="Nom du lieu *">
            <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} style={inputStyle(theme)} placeholder="Ex: Café des Arcades"/>
          </Field>
          <Field label="Type de lieu *">
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {Object.entries(TYPES).map(([k, c]) => (
                <button key={k} onClick={()=>setForm({...form, type: k})} style={{
                  background: form.type===k ? c.color : theme.surface,
                  color: form.type===k ? '#fff' : theme.text,
                  border: `1px solid ${form.type===k ? c.color : theme.border}`,
                  borderRadius: 20, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}>{c.icon} {c.label}</button>
              ))}
            </div>
          </Field>
          <Field label="Adresse *">
            <input value={form.address} onChange={e=>setForm({...form, address: e.target.value})} style={inputStyle(theme)} placeholder="Ex: 12 Rue Taillefer, 24000 Périgueux"/>
          </Field>
          <Field label="Quartier">
            <input value={form.quartier} onChange={e=>setForm({...form, quartier: e.target.value})} style={inputStyle(theme)}/>
          </Field>
          <button onClick={() => setStep(2)} style={buttonStyle(theme)}>Suivant →</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <Field label="Handicaps pris en charge">
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {Object.entries(DISABILITIES).map(([k, c]) => {
                const Icon = c.icon;
                const active = form.disabilities.includes(k);
                return (
                  <button key={k} onClick={()=>toggle('disabilities', k)} style={{
                    background: active ? theme.accent : theme.surface,
                    color: active ? '#fff' : theme.text,
                    border: `1px solid ${active ? theme.accent : theme.border}`,
                    borderRadius: 20, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    display:'flex',alignItems:'center',gap:5, fontFamily: 'inherit',
                  }}><Icon size={13}/> {c.label}</button>
                );
              })}
            </div>
          </Field>
          <Field label="Équipements disponibles">
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {Object.entries(EQUIPMENT_LABELS).map(([k, label]) => {
                const active = form.equipment.includes(k);
                return (
                  <button key={k} onClick={()=>toggle('equipment', k)} style={{
                    background: active ? theme.success : theme.surface,
                    color: active ? '#fff' : theme.text,
                    border: `1px solid ${active ? theme.success : theme.border}`,
                    borderRadius: 20, padding: '6px 10px', fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                  }}>{active && '✓ '}{label}</button>
                );
              })}
            </div>
          </Field>
          <div style={{display:'flex',gap:8}}>
            <button onClick={() => setStep(1)} style={{...buttonStyle(theme), background: theme.surface, color: theme.text, border: `1px solid ${theme.border}`}}>← Retour</button>
            <button onClick={() => setStep(3)} style={buttonStyle(theme)}>Suivant →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <Field label={`Score d'accessibilité global : ${form.score}/5`}>
            <input type="range" min="1" max="5" value={form.score} onChange={e=>setForm({...form, score: parseInt(e.target.value)})} style={{width:'100%', accentColor: theme.accent}}/>
          </Field>
          <Field label="Horaires (facultatif)">
            <input value={form.hours} onChange={e=>setForm({...form, hours: e.target.value})} style={inputStyle(theme)} placeholder="Ex: 10h-19h"/>
          </Field>
          <Field label="Téléphone (facultatif)">
            <input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} style={inputStyle(theme)}/>
          </Field>
          <Field label="Latitude / Longitude (ajustez si nécessaire)">
            <div style={{display:'flex',gap:6}}>
              <input type="number" step="0.0001" value={form.lat} onChange={e=>setForm({...form, lat: parseFloat(e.target.value)})} style={inputStyle(theme)}/>
              <input type="number" step="0.0001" value={form.lng} onChange={e=>setForm({...form, lng: parseFloat(e.target.value)})} style={inputStyle(theme)}/>
            </div>
          </Field>
          <div style={{display:'flex',gap:8}}>
            <button onClick={() => setStep(2)} style={{...buttonStyle(theme), background: theme.surface, color: theme.text, border: `1px solid ${theme.border}`}}>← Retour</button>
            <button onClick={submit} style={buttonStyle(theme)}>🌟 Publier (+50 XP)</button>
          </div>
        </div>
      )}
    </div>
  );
}

const Field = ({ label, children }) => (
  <div style={{marginBottom: 16}}>
    <div style={{fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: 6}}>{label}</div>
    {children}
  </div>
);
const inputStyle = (theme) => ({
  width: '100%', background: theme.surface, border: `1px solid ${theme.border}`,
  borderRadius: 10, padding: '10px 12px', color: theme.text, fontSize: 14,
  fontFamily: 'inherit', outline: 'none',
});
const buttonStyle = (theme) => ({
  background: theme.accent, color: '#fff', border: 'none',
  borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 700,
  cursor: 'pointer', fontFamily: 'inherit', flex: 1,
});
