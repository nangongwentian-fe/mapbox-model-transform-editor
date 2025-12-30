import { memo, useCallback, useState } from 'react'
import MapboxViewer from './components/MapboxViewer'
import { useMapboxHelperStore } from './store/useMapboxHelperStore'
import { MapboxHelper } from '@/mapboxHelper'
import { addModel, updateModelOrigin } from './utils/addModel'

const App = memo(() => {
  const { setMapboxHelper, map: mapboxHelper } = useMapboxHelperStore();
  // 模型原始位置
  const initialLng = 114.214078;
  const initialLat = 22.306616;
  // 添加经纬度状态管理
  const [lng, setLng] = useState<number>(initialLng);
  const [lat, setLat] = useState<number>(initialLat);

  const onMapLoad = useCallback((mapboxHelper: MapboxHelper) => {
    setMapboxHelper(mapboxHelper);
    const customLayer = addModel(mapboxHelper.map);
    mapboxHelper.map.addLayer(customLayer);
  }, [setMapboxHelper])

  // 处理经度输入变化
  const handleLngChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setLng(value);
      // 更新模型位置
      if (mapboxHelper) {
        updateModelOrigin(mapboxHelper.map, '3d-model', value, lat);
      }
    }
  }, [mapboxHelper, lat])

  // 处理纬度输入变化
  const handleLatChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setLat(value);
      // 更新模型位置
      if (mapboxHelper) {
        updateModelOrigin(mapboxHelper.map, '3d-model', lng, value);
      }
    }
  }, [mapboxHelper, lng])

  return (
    <div className="w-full h-full relative">
      <MapboxViewer className='w-full h-full' onMapLoad={onMapLoad} onMapRemove={() => setMapboxHelper(null)} />
      {/* 添加经纬度输入控件 */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-md z-10">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">经度</label>
          <input
            type="number"
            value={lng}
            onChange={handleLngChange}
            step="0.0001"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">纬度</label>
          <input
            type="number"
            value={lat}
            onChange={handleLatChange}
            step="0.0001"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
})

export default App