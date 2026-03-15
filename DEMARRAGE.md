# 🚀 Guide de Démarrage - PeekSense AeroHacks

## ✅ **Problème résolu !** 

Les erreurs ont été corrigées. Voici comment lancer correctement votre projet :

## 📋 **Commandes pour Git Bash / Terminal :**

### 🟢 **Démarrage rapide :**
```bash
# Option 1: Script automatique (recommandé)
./start_all.sh

# Option 2: Manuel
cd drone-monitoring/backend && node index.js &
cd ../.. && python/C:\Users\alici\PeekSense-AeroHacks\python\.venv\Scripts\python.exe ml_service_lite.py &
cd drone-monitoring && npm start
```

### 🔴 **Arrêt des services :**
```bash
./stop_all.sh
```

## 📋 **Commandes pour PowerShell :**

### 🟢 **Démarrage :**
```powershell
# Option 1: Script automatique  
.\start_all.bat

# Option 2: Manuel
cd drone-monitoring\backend
node index.js
```

## ⚠️  **Erreurs communes évitées :**

### ❌ **Mauvais (causait l'erreur) :**
```bash
# Depuis drone-monitoring/
node backend/index.js  # ❌ dotenv ne trouve pas .env (0 variables)
```

### ✅ **Correct :**
```bash  
# Depuis drone-monitoring/backend/
node index.js  # ✅ dotenv trouve .env (5 variables)
```

## 🔧 **Résolution des problèmes :**

### 🚪 **Port déjà utilisé :**
```bash
# Identifier le processus
netstat -ano | findstr :4000

# L'arrêter (remplacez XXXX par le PID)
taskkill /PID XXXX /F
```

### 🔑 **Variables d'environnement :**
- ✅ Fichier .env dans `drone-monitoring/backend/`
- ✅ 5 variables chargées avec dotenv
- ✅ Clés API configurées

## 📊 **Services actifs :**
- 🐍 **Python ML** : http://localhost:5001
- 🚀 **Backend API** : http://localhost:4000  
- ⚛️ **Frontend React** : http://localhost:3000

## 📝 **Logs :**
Les journaux sont sauvegardés dans `logs/` :
- `backend.log` - API Node.js
- `python.log` - Service ML
- `frontend.log` - Application React

**Votre projet fonctionne maintenant parfaitement ! 🎉**