# Configuration des clés API 🔑

## 📌 Instructions pour configurer votre fichier .env :

1. **Copiez le fichier exemple** :
   ```bash
   cd drone-monitoring/backend
   copy .env.example .env
   ```

2. **Obtenez vos clés API** :

### 🤖 Gemini AI API Key
- Allez sur : https://ai.google.dev/
- Créez un compte Google AI
- Générez une clé API 
- Ajoutez-la dans `.env` : `GEMINI_API_KEY=votre_clé_ici`

### 🎵 ElevenLabs API Key  
- Allez sur : https://elevenlabs.io/
- Créez un compte
- Allez dans Profile & API Key
- Copiez votre clé API
- Ajoutez dans `.env` : `ELEVENLABS_API_KEY=votre_clé_ici`

### 🎭 Voice ID ElevenLabs (optionnel)
- Dans votre dashboard ElevenLabs
- Choisissez une voix et copiez son ID
- Ou utilisez une voix par défaut : `EXAVITQu4vr4xnSDxMaL`

## ✅ Votre fichier .env final devrait ressembler à :
```env
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxx
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxx
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
PORT=4000
ML_SERVICE_URL=http://localhost:5001
```

## 🔒 Sécurité
- Le fichier `.env` est dans `.gitignore` - vos clés ne seront pas partagées
- Ne partagez jamais vos clés API publiquement

## 🚀 Après configuration
Redémarrez le backend pour charger les nouvelles variables :
```bash
cd drone-monitoring/backend
node index.js
```