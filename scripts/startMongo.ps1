$ErrorActionPreference = "Stop"

$mongoHome = Join-Path $env:LOCALAPPDATA "Programs\MongoDB\mongodb-win32-x86_64-windows-8.2.7"
$mongod = Join-Path $mongoHome "bin\mongod.exe"
$dataDir = Join-Path $env:LOCALAPPDATA "MongoDB\data\db"
$logDir = Join-Path $env:LOCALAPPDATA "MongoDB\log"
$logPath = Join-Path $logDir "mongod.log"

if (-not (Test-Path -LiteralPath $mongod)) {
    Write-Error "MongoDB est introuvable: $mongod"
    exit 1
}

New-Item -ItemType Directory -Force -Path $dataDir, $logDir | Out-Null

$existing = Get-CimInstance Win32_Process |
    Where-Object { $_.Name -eq "mongod.exe" -and $_.CommandLine -like "*--port 27017*" }

if ($existing) {
    Write-Host "MongoDB est deja lance sur 127.0.0.1:27017."
    exit 0
}

Start-Process -FilePath $mongod -ArgumentList @(
    "--dbpath", $dataDir,
    "--logpath", $logPath,
    "--logappend",
    "--bind_ip", "127.0.0.1",
    "--port", "27017"
) -WindowStyle Hidden

Start-Sleep -Seconds 3

$connection = Test-NetConnection 127.0.0.1 -Port 27017 -WarningAction SilentlyContinue

if (-not $connection.TcpTestSucceeded) {
    Write-Error "MongoDB n'a pas demarre sur 127.0.0.1:27017."
    exit 1
}

Write-Host "MongoDB lance sur 127.0.0.1:27017."
