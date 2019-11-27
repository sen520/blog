FROM node
RUN makedir data
COPY ["package.json" , "./data"]
COPY . ./data

RUN cd ./data && npm i
CMD cd ./data && npm start
