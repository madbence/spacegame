if not exist "C:\Program Files\mongodb\bin\mongod.exe" goto skip-mongo
if not exist C:\mongodb-data\nul goto skip-mongo
start cmd /C "C:\Program Files\mongodb\bin\mongod.exe" --dbpath C:\mongodb-data
timeout 3
echo Mongo DB started
goto start-app
:skip-mongo
echo Mongo DB not started
:start-app
start cmd /C npm run watch:js
start cmd /C npm run watch:css
start cmd /C npm run watch:app