FROM node
COPY ["package.json", "package-lock.json" , "./"]
COPY . .


RUN npm config set registry https://registry.npm.taobao.org;
RUN npm ci
CMD npm start