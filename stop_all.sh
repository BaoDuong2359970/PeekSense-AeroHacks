#!/bin/bash

echo "Arrêt de tous les services PeekSense AeroHacks..."

# Fonction pour arrêter un processus sur un port
kill_port() {
    local port=$1
    local name=$2
    
    pid=$(lsof -t -i:$port 2>/dev/null)
    if [ -n "$pid" ]; then
        echo "Arrêt de $name (port $port, PID: $pid)"
        kill -9 $pid
        echo "   $name arrêté"
    else
        echo "   $name n'était pas en cours d'exécution"
    fi
}

# Arrêter les services
kill_port 5001 "Service ML Python"
kill_port 4000 "Backend Node.js"  
kill_port 3000 "Frontend React"

# Nettoyer les processus node et python éventuellement restants
echo
echo "Nettoyage des processus restants..."
pkill -f "ml_service_lite.py" 2>/dev/null || true
pkill -f "node.*index.js" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

echo
echo "Tous les services ont été arrêtés !"