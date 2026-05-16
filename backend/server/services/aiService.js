const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateRoadmap = async (eleve, notes) => {
  const notesText = notes.map(n => `${n.matiere}: ${n.valeur}/20`).join(', ');
  const prompt = `Tu es un conseiller d'orientation académique marocain. Génère un roadmap professionnel personnalisé en JSON pour cet étudiant:
Nom: ${eleve.nom}, Niveau: ${eleve.niveau}, Filière: ${eleve.filiere || 'Non définie'}, Ville: ${eleve.ville}
Notes: ${notesText}
Réponds UNIQUEMENT avec un JSON valide: { "metier": "...", "description": "...", "etapes": ["..."], "matieresCles": ["..."], "conseils": "..." }`;

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });
  return JSON.parse(res.choices[0].message.content);
};

const chatbot = async (message, context = '') => {
  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: `Tu es Mowajih AI, un assistant d'orientation académique pour les étudiants marocains. Tu réponds en français. ${context}` },
      { role: 'user', content: message },
    ],
    temperature: 0.8,
  });
  return res.choices[0].message.content;
};

module.exports = { generateRoadmap, chatbot };
