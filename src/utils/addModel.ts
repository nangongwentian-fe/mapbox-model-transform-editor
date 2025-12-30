import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

export interface ModelTransform {
  translateX: number;
  translateY: number;
  translateZ: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
}

// 定义自定义图层扩展接口，包含更新模型位置的方法
export interface CustomLayerWithUpdate extends mapboxgl.CustomLayerInterface {
  updateModelOrigin?: (lng: number, lat: number) => void;
}

export const addModel = (map: mapboxgl.Map) => {
  // 模型原始位置
  const modelOrigin: [number, number] = [114.214078, 22.306616];
  // 模型高度
  const modelAltitude = 10;
  // 模型旋转角度
  const modelRotate = [Math.PI / 2, 0, 0];

  // 通过 经纬度+高程 计算地图墨卡托投影位置
  const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
    modelOrigin,
    modelAltitude
  );
  // 模型Transform
  const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
  };

  return createCustomLayer(map, modelTransform);
}

const createCustomLayer = (map: mapboxgl.Map, modelTransform: ModelTransform): CustomLayerWithUpdate => {
  const camera = new THREE.Camera();
  const scene = new THREE.Scene();

  const loader = new GLTFLoader();
  loader.load(
    '/model/runway1331-v2.glb',
    (gltf) => {
      scene.add(gltf.scene);
    }
  );

  const renderer = new THREE.WebGLRenderer({
    canvas: map.getCanvas(),
    context: map.painter.context.gl,
    antialias: true
  });

  loadEnvironment(renderer, scene);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.autoClear = false;

  const layer: CustomLayerWithUpdate = {
    id: '3d-model',
    type: 'custom',
    renderingMode: '3d',
    onAdd: () => {
      // Add logic that runs on layer addition if necessary.
    },
    render: (_gl: WebGLRenderingContext, matrix: number[]) => {
      const rotationX = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(1, 0, 0),
        modelTransform.rotateX
      );
      const rotationY = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 1, 0),
        modelTransform.rotateY
      );
      const rotationZ = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 0, 1),
        modelTransform.rotateZ
      );

      const m = new THREE.Matrix4().fromArray(matrix);
      const l = new THREE.Matrix4()
        .makeTranslation(
          modelTransform.translateX,
          modelTransform.translateY,
          modelTransform.translateZ
        )
        .scale(
          new THREE.Vector3(
            modelTransform.scale,
            -modelTransform.scale,
            modelTransform.scale
          )
        )
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);

      camera.projectionMatrix = m.multiply(l);
      renderer.resetState();
      renderer.render(scene, camera);
      map.triggerRepaint();
    },
    // 添加更新模型位置的方法
    updateModelOrigin: (lng: number, lat: number) => {
      const modelAltitude = 10;
      // 重新计算墨卡托投影坐标
      const newModelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
        [lng, lat],
        modelAltitude
      );
      // 更新模型变换参数
      modelTransform.translateX = newModelAsMercatorCoordinate.x;
      modelTransform.translateY = newModelAsMercatorCoordinate.y;
      modelTransform.translateZ = newModelAsMercatorCoordinate.z;
      modelTransform.scale = newModelAsMercatorCoordinate.meterInMercatorCoordinateUnits();
      // 触发地图重绘
      map.triggerRepaint();
    }
  };

  return layer;
}

/**
 * 更新模型位置的工具函数
 * @param map Mapbox地图实例
 * @param layerId 自定义图层ID
 * @param lng 新的经度
 * @param lat 新的纬度
 */
export const updateModelOrigin = (
  map: mapboxgl.Map,
  layerId: string,
  lng: number,
  lat: number
): void => {
  // 获取自定义图层
  const layer = map.getLayer(layerId) as unknown as CustomLayerWithUpdate;
  if (layer && layer.updateModelOrigin) {
    // 调用图层的updateModelOrigin方法更新模型位置
    layer.updateModelOrigin(lng, lat);
  }
};

const loadEnvironment = (renderer: THREE.WebGLRenderer, scene: THREE.Scene) => {
  const loader = new EXRLoader();
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  loader.load(`/hdr/citrus_orchard_road_puresky_1k.exr`, (texture: THREE.DataTexture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping; // 告诉 three.js 这是经纬度全景图
    texture.colorSpace = THREE.LinearSRGBColorSpace;          // HDR 线性（不要用 SRGBColorSpace）
    const envMap = pmrem.fromEquirectangular(texture).texture;
    scene.environment = envMap;
    texture.dispose();
    pmrem.dispose();
  });
}