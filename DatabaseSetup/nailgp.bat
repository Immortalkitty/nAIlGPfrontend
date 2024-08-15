set "POSTGRESQL_BIN_PATH=%1"

set "POSTGRES_PASSWORD=%2"

set "NAILGP_PASSWORD=%3"

:: Set the full path to your SQL file
set "CURRENT_DIR=%CD%"
set "SQL_FILE_NAME=nailgp.sql"
set "FULL_SQL_PATH=%CURRENT_DIR%\%SQL_FILE_NAME%"

:: Check the OS type and set the appropriate path
if not "%OS%"=="Windows_NT" (
    echo Unsupported OS or PostgreSQL bin not found
    exit /b
)

:: Setting up environment for database commands
cd /d %POSTGRESQL_BIN_PATH%
set PGPASSWORD=%POSTGRES_PASSWORD%

:: Drop the database if it exists
psql -h localhost -p 5432 -U postgres -c "DROP DATABASE IF EXISTS nailgp;"
if ERRORLEVEL 1 (
    echo Failed to drop database nailgp
    goto CleanUp
)

:: Drop the user if it exists
psql -h localhost -p 5432 -U postgres -c "DROP USER IF EXISTS nailgpuser;"
if ERRORLEVEL 1 (
    echo Failed to drop user nailgpuser
    goto CleanUp
)

:: Create the database user and give them the necessary permissions
psql -h localhost -p 5432 -U postgres -c "CREATE USER nailgpuser WITH ENCRYPTED PASSWORD '%NAILGP_PASSWORD%'; ALTER USER nailgpuser WITH CREATEDB;"
if ERRORLEVEL 1 (
    echo Failed to create user or modify database permissions
    goto CleanUp
)

:: Create the database with the newly created user as owner
psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE nailgp WITH OWNER nailgpuser;"
if ERRORLEVEL 1 (
    echo Failed to create database
    goto CleanUp
)

set PGPASSWORD=%NAILGP_PASSWORD%
psql -h localhost -p 5432 -U nailgpuser -d nailgp -f "%FULL_SQL_PATH%"
if ERRORLEVEL 1 (
    echo Failed to run SQL script
    goto CleanUp
)

:CleanUp
set PGPASSWORD=
endlocal
echo Script execution complete.
exit /b
