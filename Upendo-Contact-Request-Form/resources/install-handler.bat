@echo off
setlocal

set "RESOURCE_DIR=%~dp0"
set "SOURCE_HANDLER=%RESOURCE_DIR%UpendoContactFormSubmit.ashx"
set "WEBSITE_ROOT=%RESOURCE_DIR%..\..\..\..\..\.."

for %%I in ("%WEBSITE_ROOT%") do set "WEBSITE_ROOT=%%~fI"

set "TARGET_DIR=%WEBSITE_ROOT%\Portals\_default\Handlers"
set "TARGET_HANDLER=%TARGET_DIR%\UpendoContactFormSubmit.ashx"

echo Installing Upendo contact form handler...
echo Source: "%SOURCE_HANDLER%"
echo Target: "%TARGET_HANDLER%"
echo.

if not exist "%SOURCE_HANDLER%" (
    echo ERROR: Source handler was not found.
    echo Expected: "%SOURCE_HANDLER%"
    exit /b 1
)

if not exist "%TARGET_DIR%" (
    echo Creating target directory: "%TARGET_DIR%"
    mkdir "%TARGET_DIR%"
    if errorlevel 1 (
        echo ERROR: Failed to create target directory.
        exit /b 1
    )
)

copy /Y "%SOURCE_HANDLER%" "%TARGET_HANDLER%" >nul
if errorlevel 1 (
    echo ERROR: Failed to copy handler.
    exit /b 1
)

echo Handler installed successfully.
echo.
echo Next steps:
echo 1. Configure contact form environment variables or web.config appSettings.
echo 2. Replace all placeholder secrets per environment.
echo 3. Recycle DNN/IIS if configuration changes are not picked up automatically.

exit /b 0
