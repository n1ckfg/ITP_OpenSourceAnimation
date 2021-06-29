@echo off

set BASE_URL="https://fox-gieg.com/patches/github/n1ckfg/ITP_OpenSourceAnimation/docs/2012f/osa/files"
cd %~dp0
powershell -Command "Invoke-WebRequest %BASE_URL%/expressions_examples.zip -OutFile docs/2012f/osa/files/expressions_examples.zip"
powershell -Command "Invoke-WebRequest %BASE_URL%/match.mov -OutFile docs/2012f/osa/files/match.mov"

@pause