# cs-546-sneaker-store
Group project repository for CS 546 - Web Programming @ Stevens Institute of Technology

Team Members :-
1. Yash Shah
2. Kheevar Choudhary
3. Hamza Buch
4. Niyati Bavishi
---
# Seed The Database
## macOS/Linux
With your MongoDB server running in the background run :-
```
npm run seed
```

## Windows
1. In addition to the MongoDB server you need to download the command line database tools from - https://www.mongodb.com/try/download/database-tools
2. Extract the archive and place the mongorestore.exe file in the project directory.
3. With your MongoDB server running in the background, finally run :-
```
npm run seed
```

## Docker
With your MongoDB docker container running in the background run :-
```
docker cp seed.gz CONTAINER_ID:/seed.gz
docker exec CONTAINER_ID sh -c 'exec mongorestore --gzip --archive=/seed.gz --drop --db cs-546-sneaker-store'
```

# How To Run
1. Install all dependencies by running `npm install`.
2. Run the server by running `npm start`.
3. Enjoy!
