#!/usr/bin/env python3
"""
MCP Location Server for apartment search application.
Provides location-related tools including geocoding and location normalization.
"""

import asyncio
import json
import sys
from typing import Dict, Any, Optional

# Simulated MCP server for location services
class LocationMCPServer:
    def __init__(self):
        self.location_database = {
            "downtown": {"lat": 40.7589, "lon": -73.9851, "normalized": "downtown"},
            "brooklyn": {"lat": 40.6892, "lon": -73.9442, "normalized": "brooklyn"},
            "manhattan": {"lat": 40.7831, "lon": -73.9712, "normalized": "manhattan"},
            "queens": {"lat": 40.7505, "lon": -73.8370, "normalized": "queens"},
            "upper west side": {"lat": 40.7851, "lon": -73.9754, "normalized": "upper west side"},
            "east village": {"lat": 40.7281, "lon": -73.9857, "normalized": "east village"},
            "westchester": {"lat": 41.0534, "lon": -73.7629, "normalized": "westchester"},
        }

    def geocode_location(self, location: str) -> Dict[str, Any]:
        """Geocode a location string to coordinates."""
        location_lower = location.lower().strip()
        
        # Direct match
        if location_lower in self.location_database:
            data = self.location_database[location_lower]
            return {
                "success": True,
                "location": location,
                "normalized_location": data["normalized"],
                "latitude": data["lat"],
                "longitude": data["lon"],
                "confidence": 1.0
            }
        
        # Partial match
        for key, data in self.location_database.items():
            if key in location_lower or location_lower in key:
                return {
                    "success": True,
                    "location": location,
                    "normalized_location": data["normalized"],
                    "latitude": data["lat"],
                    "longitude": data["lon"],
                    "confidence": 0.8
                }
        
        # No match found
        return {
            "success": False,
            "location": location,
            "normalized_location": location_lower,
            "error": "Location not found in database"
        }

    def normalize_location(self, location: str) -> Dict[str, Any]:
        """Normalize location string to standard format."""
        location_lower = location.lower().strip()
        
        # Common location aliases
        aliases = {
            "nyc": "manhattan",
            "new york": "manhattan",
            "new york city": "manhattan",
            "bk": "brooklyn",
            "bklyn": "brooklyn",
            "midtown": "manhattan",
            "times square": "manhattan",
            "central park": "manhattan",
        }
        
        if location_lower in aliases:
            normalized = aliases[location_lower]
        else:
            normalized = location_lower
        
        return {
            "original_location": location,
            "normalized_location": normalized,
            "aliases_used": location_lower in aliases
        }

    def calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> Dict[str, Any]:
        """Calculate distance between two coordinates."""
        import math
        
        # Haversine formula
        R = 6371  # Earth's radius in kilometers
        
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        
        a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(dlon / 2) * math.sin(dlon / 2))
        
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance_km = R * c
        distance_miles = distance_km * 0.621371
        
        return {
            "distance_km": round(distance_km, 2),
            "distance_miles": round(distance_miles, 2),
            "coordinates": {
                "from": {"lat": lat1, "lon": lon1},
                "to": {"lat": lat2, "lon": lon2}
            }
        }

    async def handle_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Handle incoming MCP requests."""
        tool_name = request.get("tool")
        params = request.get("params", {})
        
        try:
            if tool_name == "geocode_location":
                location = params.get("location", "")
                result = await self.geocode_location(location)
                
            elif tool_name == "normalize_location":
                location = params.get("location", "")
                result = await self.normalize_location(location)
                
            elif tool_name == "calculate_distance":
                lat1 = params.get("lat1")
                lon1 = params.get("lon1")
                lat2 = params.get("lat2")
                lon2 = params.get("lon2")
                
                if None in [lat1, lon1, lat2, lon2]:
                    result = {"error": "Missing required coordinates"}
                else:
                    result = await self.calculate_distance(lat1, lon1, lat2, lon2)
                    
            else:
                result = {"error": f"Unknown tool: {tool_name}"}
                
            return {"success": True, "result": result}
            
        except Exception as e:
            return {"success": False, "error": str(e)}

async def main():
    """Main server loop for stdio transport."""
    server = LocationMCPServer()
    
    print("Location MCP Server started", file=sys.stderr)
    
    while True:
        try:
            # Read request from stdin
            line = sys.stdin.readline()
            if not line:
                break
                
            request = json.loads(line.strip())
            
            # Process request
            response = await server.handle_request(request)
            
            # Send response to stdout
            print(json.dumps(response))
            sys.stdout.flush()
            
        except json.JSONDecodeError:
            error_response = {"success": False, "error": "Invalid JSON"}
            print(json.dumps(error_response))
            sys.stdout.flush()
            
        except Exception as e:
            error_response = {"success": False, "error": str(e)}
            print(json.dumps(error_response))
            sys.stdout.flush()

if __name__ == "__main__":
    asyncio.run(main())

