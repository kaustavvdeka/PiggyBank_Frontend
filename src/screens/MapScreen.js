import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '../../src/theme';

export default function MapScreen() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emergency Services Finder</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;line-height:1.6;color:#333;background:#f5f7fa}
      .container{max-width:1200px;margin:0 auto;padding:12px}
      header{ text-align:center;margin-bottom:16px;padding:12px;background:#2c3e50;color:#fff;border-radius:8px}
      .app-container{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px}
      .map-section{flex:1;min-width:280px;height:420px;border-radius:8px;overflow:hidden}
      #map{width:100%;height:100%}
      .controls-section{flex:1;min-width:280px;background:#fff;padding:12px;border-radius:8px}
      .input-group{margin-bottom:12px}
      label{display:block;margin-bottom:6px;font-weight:600}
      input[type="text"]{width:100%;padding:10px;border:1px solid #ddd;border-radius:6px}
      input[type="range"]{width:100%}
      .buttons{display:flex;gap:10px;margin-top:10px}
      button{padding:10px 14px;border:none;border-radius:6px;color:#fff}
      #search-btn{background:#2980b9;flex:2}
      #reset-btn{background:#c0392b;flex:1}
      .results-section{background:#fff;padding:12px;border-radius:8px}
      .results-container{display:flex;flex-wrap:wrap;gap:12px;margin-top:10px}
      .result-card{flex:1;min-width:280px;background:#f8f9fa;border-radius:8px;padding:10px}
      .service-list{list-style:none}
      .service-list li{padding:8px;margin-bottom:8px;background:#fff;border-radius:6px;border-left:4px solid #3498db}
      .loader{display:none;text-align:center;padding:10px}
    </style>
  </head>
  <body>
    <div class="container">
      <header>
        <h1><i class="fas fa-map-marker-alt"></i> PiggyBoi</h1>
        <p class="description">Find </p>
      </header>
      <div class="app-container">
        <div class="map-section"><div id="map"></div></div>
        <div class="controls-section">
          <div class="input-group">
            <label for="location-search"><i class="fas fa-search"></i> Search for a location:</label>
            <input type="text" id="location-search" placeholder="Enter an address or place name">
          </div>
          <div class="input-group">
            <label for="geofence-radius"><i class="fas fa-arrows-alt-h"></i> Geofence Radius: <span id="radius-value" class="radius-value">1000</span> meters</label>
            <input type="range" id="geofence-radius" min="500" max="5000" step="500" value="1000">
          </div>
          <div class="buttons">
            <button id="search-btn"><i class="fas fa-search"></i> Find Emergency Services</button>
            <button id="reset-btn"><i class="fas fa-redo"></i> Reset</button>
          </div>
          <div class="loader" id="loader">
            <div class="loader-spinner"></div>
            <p>Searching for emergency services...</p>
          </div>
        </div>
      </div>
      <div class="results-section">
        <h2><i class="fas fa-list-alt"></i> Results</h2>
        <div class="results-container">
          <div class="result-card">
            <h3><i class="fas fa-hospital"></i> Hospitals</h3>
            <ul id="hospitals-list" class="service-list">
              <li><i class="fas fa-info-circle"></i> No results yet. Search for a location to find hospitals.</li>
            </ul>
          </div>
          <div class="result-card">
            <h3><i class="fas fa-building"></i> Medicals</h3>
            <ul id="police-list" class="service-list">
              <li><i class="fas fa-info-circle"></i> No results yet. Search for a location </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script>(function(){
      const mapElement=document.getElementById('map');
      const radiusSlider=document.getElementById('geofence-radius');
      const radiusValue=document.getElementById('radius-value');
      const locationSearchInput=document.getElementById('location-search');
      const searchBtn=document.getElementById('search-btn');
      const resetBtn=document.getElementById('reset-btn');
      const hospitalsList=document.getElementById('hospitals-list');
      const policeList=document.getElementById('police-list');
      const defaultCoords={lat:28.6139,lng:77.2090};
      let currentLatLng={...defaultCoords};
      let currentRadius=1000; let marker, geofenceCircle;
      const map=L.map(mapElement).setView([currentLatLng.lat,currentLatLng.lng],13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap'}).addTo(map);
      function updateMarker(){ if(marker){ marker.setLatLng([currentLatLng.lat,currentLatLng.lng]); } else { marker=L.marker([currentLatLng.lat,currentLatLng.lng],{draggable:true}).addTo(map); marker.on('dragend', handleMarkerDrag);} }
      function updateGeofenceCircle(){ if(geofenceCircle){ map.removeLayer(geofenceCircle);} geofenceCircle=L.circle([currentLatLng.lat,currentLatLng.lng],{color:'blue',fillColor:'#30a5ff',fillOpacity:0.2,radius:currentRadius}).addTo(map); }
      function searchLocation(){ const query=locationSearchInput.value; if(!query) return; fetch('https://nominatim.openstreetmap.org/search?format=json&q='+encodeURIComponent(query)).then(r=>r.json()).then(data=>{ if(data&&data[0]){ const d=data[0]; currentLatLng={lat:parseFloat(d.lat),lng:parseFloat(d.lon)}; map.setView([currentLatLng.lat,currentLatLng.lng],15); updateMarker(); updateGeofenceCircle(); } else { alert('Location not found'); }}).catch(()=>alert('Search error')); }
      function findEmergencyServices(){ document.getElementById('loader').style.display='block'; hospitalsList.innerHTML=''; policeList.innerHTML=''; const url='https://api.radar.io/v1/search/places?categories=hospital,police&near='+currentLatLng.lat+','+currentLatLng.lng+'&radius='+currentRadius+'&limit=10'; fetch(url,{ headers:{ 'Authorization':'prj_live_pk_1a248cd9d7d92405678712d1fc0cfe79d4e04a3a' }}).then(r=>r.json()).then(data=>{ const hospitals=[]; const police=[]; (data.places||[]).forEach(p=>{ if((p.categories||[]).includes('hospital')) hospitals.push(p.name||'Unnamed Hospital'); if((p.categories||[]).includes('police')) police.push(p.name||'Unnamed Police Station'); }); hospitalsList.innerHTML=hospitals.length? hospitals.map(h=>'<li><i class='+'"'+'fas fa-hospital'+'"'+'></i> '+h+'</li>').join(''):'<li><i class='+'"'+'fas fa-info-circle'+'"'+'></i> No hospitals found.</li>'; policeList.innerHTML=police.length? police.map(h=>'<li><i class='+'"'+'fas fa-building'+'"'+'></i> '+h+'</li>').join(''):'<li><i class='+'"'+'fas fa-info-circle'+'"'+'></i> No police stations found.</li>'; }).catch(()=>{ hospitalsList.innerHTML='<li>Error fetching data</li>'; policeList.innerHTML='<li>Error fetching data</li>'; }).finally(()=>{ document.getElementById('loader').style.display='none'; }); }
      function resetSearch(){ currentLatLng={...defaultCoords}; currentRadius=1000; map.setView([currentLatLng.lat,currentLatLng.lng],13); updateMarker(); updateGeofenceCircle(); radiusSlider.value=currentRadius; radiusValue.textContent=currentRadius; locationSearchInput.value=''; hospitalsList.innerHTML='<li>No results yet. Search for a location.</li>'; policeList.innerHTML='<li>No results yet. Search for a location.</li>'; }
      function handleRadiusChange(){ currentRadius=parseInt(this.value); radiusValue.textContent=currentRadius; updateGeofenceCircle(); }
      function handleMapClick(e){ currentLatLng={lat:e.latlng.lat,lng:e.latlng.lng}; updateMarker(); updateGeofenceCircle(); }
      function handleMarkerDrag(){ const position=marker.getLatLng(); currentLatLng={lat:position.lat,lng:position.lng}; updateGeofenceCircle(); }
      function handleSearchKeypress(e){ if(e.key==='Enter'){ searchLocation(); } }
      radiusSlider.addEventListener('input', handleRadiusChange);
      map.on('click', handleMapClick);
      searchBtn.addEventListener('click', findEmergencyServices);
      resetBtn.addEventListener('click', resetSearch);
      locationSearchInput.addEventListener('keypress', handleSearchKeypress);
      (function init(){ updateMarker(); updateGeofenceCircle(); })();
    })();</script>
  </body>
  </html>`;
  return (
    <View style={styles.container}>
      <WebView originWhitelist={['*']} source={{ html }} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
