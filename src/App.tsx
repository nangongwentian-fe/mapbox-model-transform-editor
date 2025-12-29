import { memo, useCallback } from 'react'
import MapboxViewer from './components/MapboxViewer'
import { useMapboxHelperStore } from './store/useMapboxHelperStore'
import { MapboxHelper } from '@/mapboxHelper'
import { addModel } from './utils/addModel'

const App = memo(() => {
  const { setMapboxHelper } = useMapboxHelperStore();

  const onMapLoad = useCallback((mapboxHelper: MapboxHelper) => {
    setMapboxHelper(mapboxHelper);
    const customLayer = addModel(mapboxHelper.map);
    mapboxHelper.map.addLayer(customLayer);
  }, [setMapboxHelper])

  return (
    <div className="w-full h-full">
      <MapboxViewer className='w-full h-full' onMapLoad={onMapLoad} onMapRemove={() => setMapboxHelper(null)} />
    </div>
  )
})

export default App