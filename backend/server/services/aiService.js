const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateRoadmap = async (eleve, notes, onetProfil = null) => {
  const notesText = notes.length
    ? notes.map(n => `${n.matiere}: ${n.valeur}/20 (coeff ${n.coefficient})`).join(', ')
    : 'Aucune note disponible';

  const moyenne = notes.length
    ? (notes.reduce((s, n) => s + parseFloat(n.valeur) * parseFloat(n.coefficient), 0) /
       notes.reduce((s, n) => s + parseFloat(n.coefficient), 0)).toFixed(1)
    : null;

  const onetText = onetProfil
    ? `Profil RIASEC: ${onetProfil.primaryInterest} (primaire), ${onetProfil.secondaryInterest} (secondaire), ${onetProfil.tertiaryInterest} (tertiaire). Job Zone visée: ${onetProfil.jobZone}/5.${onetProfil.dreamJob ? ` Métier rêvé: ${onetProfil.dreamJob}.` : ''}${onetProfil.dreamUni ? ` Université rêvée: ${onetProfil.dreamUni}.` : ''}`
    : 'Profil RIASEC non disponible.';

  const prompt = `Tu es un conseiller d'orientation académique expert du système marocain (Bac, CPGE, BTS, universités publiques, grandes écoles comme ENSA, ENCG, EHTP, EMI, ISCAE). Génère un roadmap professionnel personnalisé en JSON pour cet étudiant:

Nom: ${eleve.nom}
Niveau: ${eleve.niveau}
Filière: ${eleve.filiere || 'Non définie'}
Ville: ${eleve.ville || 'Non précisée'}
Moyenne générale: ${moyenne ? moyenne + '/20' : 'Non disponible'}
Notes détaillées: ${notesText}
${onetText}

Réponds UNIQUEMENT avec un JSON valide sans markdown:
{"metier":"...","description":"...","etapes":["...","...","...","..."],"matieresCles":["...","..."],"universites":["...","..."],"conseils":"...","alertes":["..."]}`;

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const text = res.choices[0].message.content.replace(/```json|```/g, '').trim();
  return JSON.parse(text);
};

// Supports full conversation history for memory
const chatbot = async (message, context = '', history = []) => {
  const systemPrompt = `Tu es Mowajih AI, un assistant d'orientation académique expert du système éducatif marocain. Tu connais les CPGEs, BTS, licences, masters, ENSA, ENCG, EHTP, EMI, ISCAE, universités publiques, concours CNC, ENSA, ENCG. Tu réponds en français, de façon concise et pratique. Tu adaptes tes conseils au profil réel de l'étudiant.

Contexte étudiant: ${context || 'Non disponible'}`;

  // Build messages array with history for memory
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: message },
  ];

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.75,
  });
  return res.choices[0].message.content;
};

module.exports = { generateRoadmap, chatbot };
