import { memo, useRef } from 'react'
import type { MapboxViewerProps } from './types';
import { MapboxHelper } from '@/mapboxHelper';
import { useMount } from 'ahooks';
import './index.scss'


const MapboxViewer = memo<MapboxViewerProps>(({ className, style, mapOptions, onMapLoad }) => {
  const container = useRef<HTMLDivElement>(null);
  useMount(() => {
    // 如果没有container，提示报错
    if (!container.current) {
      console.error('mapbox viewer container is null')
      return
    }
    // 创建MapboxHelper实例
    const mapboxHelper = new MapboxHelper({
      ...mapOptions,
      container: container.current,
    })
    // 监听map加载完成事件
    mapboxHelper.map.on('load', () => {
      onMapLoad?.(mapboxHelper);
    });
  })
  return (
    <div ref={container} className={className} style={style}></div>
  )
})

export default MapboxViewer