#!/bin/bash

echo "Démarrage de PeekSense AeroHacks..."
echo

# Vérifier que les services ne sont pas déjà en cours
echo "Vérification des ports..."

# Vérifier port 5001 (Python ML)
if lsof -i :5001 >/dev/null 2>&1; then
    echo "Port 5001 déjà utilisé (Python ML)"
fi

# Vérifier port 4000 (Backend)
if lsof -i :4000 >/dev/null 2>&1; then
    echo "Port 4000 déjà utilisé (Backend Node.js)"
fi

# Vérifier port 3000 (Frontend)
if lsof -i :3000 >/dev/null 2>&1; then
    echo "Port 3000 déjà utilisé (Frontend React)"
fi

echo
echo "1. Démarrage du service ML Python (Port 5001)..."
cd python
nohup python .venv/Scripts/python.exe ml_service_lite.py > ../logs/python.log 2>&1 &
echo "   ML Service démarré en arrière-plan"
cd ..

echo
echo "2. Démarrage du backend Node.js (Port 4000)..."
if [ ! -f "drone-monitoring/backend/.env" ]; then
    echo "   WARNING: Fichier .env manquant ! Consultez API_KEYS_SETUP.md"
    sleep 2
fi

cd drone-monitoring/backend
nohup node index.js > ../../logs/backend.log 2>&1 &
echo "   Backend API démarré en arrière-plan"
cd ../..

echo
echo "3. ⚛️  Démarrage du frontend React (Port 3000)..."
cd drone-monitoring
nohup npm start > ../logs/frontend.log 2>&1 &
echo "   Frontend React démarré en arrière-plan"
cd ..

echo
echo "✅ Tous les services sont en cours de démarrage..."
echo "📱 Services disponibles :"
echo "   - Service ML: http://localhost:5001"
echo "   - Backend API: http://localhost:4000"  
echo "   - Frontend: http://localhost:3000"
echo
echo "📋 Logs disponibles dans le dossier 'logs/'"
echo "🛑 Pour arrêter tous les services: ./stop_all.sh"