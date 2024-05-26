@echo off
setlocal


set "CURRENT_DIR=%CD%"
set "PGPATH="

set "SQL_FILE_NAME=nailgp.sql"
set "FULL_SQL_PATH=%CURRENT_DIR%\%SQL_FILE_NAME%"


if "%OS%"=="Windows_NT" (
    set "PGPATH="
) else if exist /usr/local/pgsql/bin (
    set PGPATH=/usr/local/pgsql/bin
) else (
    echo Unsupported OS or PostgreSQL bin not found
    exit /b
)


cd /d %PGPATH%
set PGPASSWORD=password
psql -h localhost -p 5432 -U postgres -c "CREATE user nailgpuser with encrypted password 'password';alter user sinutronic with createdb;"
psql -h localhost -p 5432 -U postgres -c "create database nailgp with owner=nailgpuser;"


set PGPASSWORD=password

psql -h localhost -p 5432 -U nailgpuser -d nailgp -f "%FULL_SQL_PATH%"
set PGPASSWORD=

:: Zakończenie i czyszczenie
endlocal