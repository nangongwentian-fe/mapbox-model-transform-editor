# 模型Transform可视化编辑器（适用于Mapbox中使用threejs加载的模型）

## 开始项目

1. 安装依赖
    ```bash
    pnpm install
    ```
2. 创建.env文件，并且把.env.example文件中的内容复制到.env文件中。
3. 在.env文件中配置Mapbox token
     - 申请Mapbox token：[Mapbox账号注册](https://www.mapbox.com/)
     - 将申请到的token添加到.env文件中：
        ```
        VITE_MAPBOX_TOKEN=your_mapbox_token_here
        ```
4. 启动项目
    ```bash
    pnpm dev
    ```