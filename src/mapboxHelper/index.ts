import mapboxgl from 'mapbox-gl';

export class MapboxHelper {
  map: mapboxgl.Map;
  constructor(mapOptions: mapboxgl.MapOptions) {
    // 合并mapOptions和默认选项
    const mergedOptions = Object.assign({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [114.2133557082447, 22.306057199999998], // starting position [lng, lat]
      zoom: 13, // starting zoom
      // 关闭地图的版权信息
      attributionControl: false,
      // 开启抗锯齿
      antialias: true,
    }, mapOptions);
    // 创建mapboxgl.Map实例
    this.map = new mapboxgl.Map(mergedOptions);
  }
}