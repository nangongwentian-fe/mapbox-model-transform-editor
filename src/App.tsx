import { memo, useCallback } from 'react'
import MapboxViewer from './components/MapboxViewer'
import { useMapboxHelperStore } from './store/useMapboxHelperStore'
import { MapboxHelper } from '@/mapboxHelper'

const App = memo(() => {
  const { setMapboxHelper } = useMapboxHelperStore();

  const onMapLoad = useCallback((mapboxHelper: MapboxHelper) => {
    setMapboxHelper(mapboxHelper)
  }, [setMapboxHelper])

  return (
    <div className="w-full h-full">
      <MapboxViewer className='w-full h-full' onMapLoad={onMapLoad} />
    </div>
  )
})

export default App