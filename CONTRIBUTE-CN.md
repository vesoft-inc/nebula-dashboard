## NEBULAGRAPH Dashboard 贡献指南
感谢您感兴趣参与贡献 NebulaGraph Dashboard. 请阅读完本篇指南以了解如何进行开发和提交代码至仓库。

## 本地部署
![](./architecture.png)

### 开发环境
- nodejs >= v16

### 技术栈
- typescript
- nodejs

### 本地启动项目
1. fork 本仓库至您的github个人仓库中
2. clone[仓库代码](https://github.com/vesoft-inc/nebula-dashboard.git)
```
git clone https://github.com/vesoft-inc/nebula-dashboard.git
```
3. 安装node modules
```
npm install
```
4. 将vendors/config-relaease.yaml 复制到devserver文件夹，并改名为config.yaml.并修改config.yaml,以使本地web可以连接获取到prometheus数据以及知道监控哪个 NebulaGraph 集群

4. 启动项目
```
npm run dev
```
5. 访问 ```http://localhost:7003```查看本地web页面

### 如何提交
1. 创建提交
```
git add .
git commit -m "your commit info"
git push [your self origin]
```

2. 创建pull request
