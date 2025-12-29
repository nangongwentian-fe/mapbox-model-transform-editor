import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface ModelTransform {
  translateX: number;
  translateY: number;
  translateZ: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
}

export const addModel = (map: mapboxgl.Map) => {
  // 模型原始位置
  const modelOrigin: [number, number] = [114.2129, 22.3038];
  // 模型高度
  const modelAltitude = 0;
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

const createCustomLayer = (map: mapboxgl.Map, modelTransform: ModelTransform): mapboxgl.CustomLayerInterface => {
  const camera = new THREE.Camera();
  const scene = new THREE.Scene();

  const directionalLight1 = new THREE.DirectionalLight(0xffffff);
  directionalLight1.position.set(0, -70, 100).normalize();
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff);
  directionalLight2.position.set(0, 70, 100).normalize();
  scene.add(directionalLight2);

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

  renderer.autoClear = false;

  return {
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
    }
  };
}