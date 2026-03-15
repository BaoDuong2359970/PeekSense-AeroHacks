function calculateDirection(lat1, lon1, lat2, lon2) {
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const eps = 0.00001;

  if (Math.abs(dLat) < eps && Math.abs(dLon) < eps) return "same location";

  if (dLat > 0 && Math.abs(dLon) < eps) return "north";
  if (dLat < 0 && Math.abs(dLon) < eps) return "south";
  if (Math.abs(dLat) < eps && dLon > 0) return "east";
  if (Math.abs(dLat) < eps && dLon < 0) return "west";

  if (dLat > 0 && dLon > 0) return "north-east";
  if (dLat > 0 && dLon < 0) return "north-west";
  if (dLat < 0 && dLon > 0) return "south-east";
  if (dLat < 0 && dLon < 0) return "south-west";

  return "unknown";
}

module.exports = { calculateDirection };