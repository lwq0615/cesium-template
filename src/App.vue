<template>
  <div id="cesiumContainer">
    <PointInfo ref="pointInfoRef" />
  </div>
</template>

<script setup>
import PointInfo from "./components/PointInfo.vue";
import * as Cesium from "cesium";
import { onMounted, ref } from "vue";
import fujian_point from "./gis_source/fujian_point.json";

const pointInfoRef = ref();
const entityPosition = ref()

onMounted(() => {
  const viewer = new Cesium.Viewer("cesiumContainer", {
    animation: false, //动画小部件
    baseLayerPicker: false, //地图图层组件
    fullscreenButton: true, //全屏组件
    geocoder: false, //地理编码搜索组件
    homeButton: false, //首页组件
    infoBox: false, //信息框
    sceneModePicker: true, //场景模式
    sceneMode: Cesium.SceneMode.SCENE2D,
    selectionIndicator: false, //选取指示器组件
    timeline: false, //时间轴
    navigationHelpButton: false, //帮助按钮
    navigationInstructionsInitiallyVisible: false
  });
  // 隐藏logo信息
  viewer._cesiumWidget._creditContainer.style.display = "none";
  viewer.scene.camera.setView({
    destination: new Cesium.Cartesian3.fromDegrees(118.31, 26.07, 1300000)
  });

  // 添加边界
  // 这是请求阿里DataV上的数据
  const jsonData = `https://geo.datav.aliyun.com/areas_v3/bound/350000_full.json`;
  // jsonData一定要json文件
  const geoJSON = Cesium.GeoJsonDataSource.load(jsonData, {
    stroke: Cesium.Color.fromCssColorString("#00fcff"),
    fill: Cesium.Color.fromCssColorString("#ffffff").withAlpha(0.0),
    strokeWidth: 3,
    markerSymbol: "?"
  });
  viewer.dataSources.add(geoJSON);

  // 添加点位
  fujian_point.forEach(city => {
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(city.longitude, city.latitude),
      point: {
        color: Cesium.Color.RED, //点位颜色
        pixelSize: 10 //像素点大小
      },
      point: {
        color: Cesium.Color.fromCssColorString("#ff8a00"),
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 2,
        pixelSize: 5
      },
      label: {
        text: city.name,
        font: "12pt Source Han Sans CN", //字体样式
        fillColor: Cesium.Color.WHITE, //字体颜色
        backgroundColor: Cesium.Color.TRANSPARENT, //背景颜色
        showBackground: false, //是否显示背景颜色
        style: Cesium.LabelStyle.FILL, //label样式
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直位置
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER, //水平位置
        pixelOffset: new Cesium.Cartesian2(0, -10) //偏移
      }
    });
  });

  // 设置弹窗位置
  function pointInfoSetPosition() {
    let screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      viewer.scene,
      entityPosition.value
    );
    // 显示弹窗
    pointInfoRef.value.show(screenPosition);
  }

  // 点击弹窗
  viewer.screenSpaceEventHandler.setInputAction(movement => {
    // 获取点击的位置
    var pickedObject = viewer.scene.pick(movement.position);
    // 判断是否选中了一个实体
    if (
      Cesium.defined(pickedObject) &&
      pickedObject.id instanceof Cesium.Entity
    ) {
      var entity = pickedObject.id;
      if (entity.position) {
        // 获取位置信息
        entityPosition.value = entity.position.getValue(
          viewer.clock.currentTime
        );
        pointInfoSetPosition(entityPosition.value);
      } else {
        pointInfoRef.value.hide();
      }
    } else {
      // 隐藏弹窗
      pointInfoRef.value.hide();
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // 监听 Viewer 的 postRender 事件，在地图移动时更新弹窗位置
  viewer.scene.postRender.addEventListener(() => {
    if (entityPosition.value) {
      pointInfoSetPosition();
    }
  });
});
</script>

<style lang="scss" scoped>
#cesiumContainer {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>

<style lang="scss">
body,
html,
#root {
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
}
</style>