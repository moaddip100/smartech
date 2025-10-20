<#
Простой PowerShell-скрипт для загрузки содержимого папки dist/ на FTP-хостинг (Hostinger).
Заполните переменные $ftpHost, $ftpUser, $ftpPass, $remotePath и запустите из PowerShell.

Примечание: В Windows встроенная поддержка FTP в PowerShell ограничена; если у вас установлен WinSCP,
рекомендуется использовать WinSCP CLI для безопасной и надёжной передачи. Ниже - вариант на WebClient.
#>

param()

$ftpHost = "your-ftp-host"    # пример: ftp.yourdomain.com или server.hostinger.com
$ftpUser = "ftp-username"
$ftpPass = "ftp-password"
$localPath = Join-Path -Path $PSScriptRoot -ChildPath "..\dist"
$remotePath = "/public_html/"

if (!(Test-Path $localPath)) {
    Write-Host "Папка dist/ не найдена по пути: $localPath" -ForegroundColor Red
    exit 1
}

Write-Host "Буду загружать файлы из: $localPath -> ftp://$ftpHost$remotePath"

# Рекурсивная загрузка файлов через базовый FTPWebRequest
function Upload-File {
    param($localFile, $remoteFile)
    # Ensure remoteFile starts with '/'
    if (-not $remoteFile.StartsWith('/')) { $remoteFile = '/' + $remoteFile }
    $uri = "ftp://$ftpHost$remoteFile"
    $request = [System.Net.FtpWebRequest]::Create($uri)
    $request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    $request.UseBinary = $true
    $request.UsePassive = $true

    $fileContents = [System.IO.File]::ReadAllBytes($localFile)
    $request.ContentLength = $fileContents.Length
    $rs = $request.GetRequestStream()
    $rs.Write($fileContents, 0, $fileContents.Length)
    $rs.Close()
    $resp = $request.GetResponse()
    $resp.Close()
}

function Ensure-RemoteDir {
    param($dirPath)
    # Попытка создать директорию (если уже есть — сервер вернёт ошибку, которую игнорируем)
    try {
        if (-not $dirPath.StartsWith('/')) { $dirPath = '/' + $dirPath }
        # Создаём сегменты пути по очереди: /public_html/dir1/dir2/
        $parts = $dirPath.TrimStart('/').Split('/') | Where-Object { $_ -ne '' }
        $acc = ''
        foreach ($p in $parts) {
            $acc = $acc + '/' + $p
            $uri = "ftp://$ftpHost$acc"
            try {
                $req = [System.Net.FtpWebRequest]::Create($uri)
                $req.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
                $req.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
                $req.GetResponse() | Out-Null
            } catch {
                # игнорируем ошибки (включая "550 Directory already exists")
            }
        }
    } catch {
        # Игнорируем ошибки (обычно "550 Directory already exists")
    }
}

Get-ChildItem -Path $localPath -Recurse -File | ForEach-Object {
    $relative = $_.FullName.Substring($localPath.Length).TrimStart('\') -replace '\\','/'
    $remoteFile = ($remotePath.TrimEnd('/') + '/' + $relative).TrimStart('/')
    $remoteDir = ([System.IO.Path]::GetDirectoryName($remoteFile) -replace '\\','/') + '/'
    Ensure-RemoteDir $remoteDir
    Write-Host "Uploading $($_.FullName) -> $remoteDir" -ForegroundColor Green
    try {
        Upload-File -localFile $_.FullName -remoteFile $remoteFile
    } catch {
        Write-Host "Ошибка при загрузке $($_.FullName): $_" -ForegroundColor Red
    }
}

Write-Host "Загрузка завершена." -ForegroundColor Cyan
