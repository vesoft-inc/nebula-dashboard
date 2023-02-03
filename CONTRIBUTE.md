## NEBULAGRAPH Dashboard Contributing Guide
Thank you for your interest in contributing to the NebulaGraph Dashboard. Please read this guide to learn how to develop and submit code to the repository.

## 本地部署
![](./architecture.png)

### Development Environment
- nodejs >= v16

### Technology Stack
- typescript
- nodejs

### Get Start in Local
1. fork this repository to your personal github repository.
2. clone[repository code](https://github.com/vesoft-inc/nebula-dashboard.git)
```
git clone https://github.com/vesoft-inc/nebula-dashboard.git
```
3. install node modules
```
npm install
```
4. Copy vendors/config-relaease.yaml to the devserver folder and rename it to config.yaml. And modify config.yaml so that the local web can connect to get prometheus data and know which NebulaGraph cluster to monitor.

4. Start Project
```
npm run dev
```
5. Visit ```http://localhost:7003``` to view the local web page

### How to commit
1. Create Commit
```
git add .
git commit -m "your commit info"
git push [your self origin]
```

2. create pull request
