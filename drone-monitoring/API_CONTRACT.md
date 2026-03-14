# PeekSense AeroHacks — API Contract

This document defines the shared data structures, enums, and socket events used by the system.

All modules (backend, frontend, drone services, AI services) must follow these schemas.

---

# 1. Detection Object

Used for anything the drone detects.

```json
{
  "id": "det_001",
  "type": "human | distress_human | animal | gunshot | fire_anomaly",
  "latitude": 45.5032,
  "longitude": -73.5724,
  "confidence": 0.87,
  "timestamp": "ISO",
  "droneId": "drone-01",
  "immobile": false,
  "audioLabel": "scream | gunshot | null"
}