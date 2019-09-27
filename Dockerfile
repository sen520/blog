FROM node
COPY ["package.json", "package-lock.json", "./"]
COPY . .
RUN npm i
CMD npm start