FROM node
ENV NODE_ENV production
COPY . .
RUN npm install
EXPOSE 3000
CMD npm start