@echo off

::Initialize GitHub
git init

::Pull any external changes
git pull

::Add all files in the directory
git add .

::Prompt for commit message
echo:
echo Enter commit message ^(default is 'autopush commit'^)^:
set /p "message="
if not defined message set "message=autopush commit"
echo:

::Commit all changes
git commit -m "%message%"

::Push all changes to GitHub 
git push

::Wait 5 seconds before closing
echo Commit made. Exiting...
TIMEOUT 10