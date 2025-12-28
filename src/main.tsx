import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
// 引入mapbox-gl的css
import 'mapbox-gl/dist/mapbox-gl.css';
// 引入mapbox-gl
import mapboxgl from 'mapbox-gl';
import './assets/styles/tailwind.css'

// 将.env文件中的VITE_MAPBOX_TOKEN赋值给mapboxgl.accessToken（只需要全局设置一次即可）
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
