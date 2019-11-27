FROM node
COPY ["package.json" , "."]
COPY . .

RUN npm i
CMD npm start
