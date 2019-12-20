FROM node
COPY ["package.json", "package-lock.json" , "./"]
COPY . .

RUN npm ci
CMD npm start
