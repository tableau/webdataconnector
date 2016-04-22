@echo off
REM Batch file to run Python webserver on Windows
REM ----------------------------------------------

C:
IF EXIST C:\Python27 GOTO PYTHON27
IF EXIST C:\Python34  GOTO PYTHON34
IF EXIST C:\Python35  GOTO PYTHON35
GOTO DEFAULT

:PYTHON27
C:\Python27\python.exe -m SimpleHTTPServer 8888
GOTO :END

:PYTHON34
C:\Python34\python.exe -m http.server 8888
GOTO :END

:PYTHON35
C:\Python35\python.exe -m http.server 8888
GOTO :END

REM Just try our Python 2.7 stuff
:DEFAULT
python -m SimpleHTTPServer 8888

:END