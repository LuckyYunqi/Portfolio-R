param(
    [int]$Port = 0,
    [string]$HostName = ''
)

$ErrorActionPreference = 'Stop'

function Import-DotEnv([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path)) {
        return
    }

    Get-Content -LiteralPath $Path | ForEach-Object {
        $line = $_.Trim()
        if (-not $line -or $line.StartsWith('#') -or -not $line.Contains('=')) {
            return
        }

        $name, $value = $line.Split('=', 2)
        $name = $name.Trim()
        $value = $value.Trim().Trim('"').Trim("'")

        if ($name) {
            [Environment]::SetEnvironmentVariable($name, $value, 'Process')
        }
    }
}

function Get-LocalIPv4 {
    $addresses = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
        Where-Object {
            $_.IPAddress -notlike '127.*' -and
            $_.PrefixOrigin -ne 'WellKnown' -and
            $_.IPAddress -notlike '169.254.*'
        } |
        Select-Object -ExpandProperty IPAddress -First 1

    if ($addresses) {
        return $addresses
    }

    return 'localhost'
}

function Get-ContentType([string]$Path) {
    switch ([IO.Path]::GetExtension($Path).ToLowerInvariant()) {
        '.html' { 'text/html; charset=utf-8' }
        '.htm'  { 'text/html; charset=utf-8' }
        '.css'  { 'text/css; charset=utf-8' }
        '.js'   { 'application/javascript; charset=utf-8' }
        '.json' { 'application/json; charset=utf-8' }
        '.svg'  { 'image/svg+xml' }
        '.png'  { 'image/png' }
        '.jpg'  { 'image/jpeg' }
        '.jpeg' { 'image/jpeg' }
        '.gif'  { 'image/gif' }
        '.ico'  { 'image/x-icon' }
        '.txt'  { 'text/plain; charset=utf-8' }
        default { 'application/octet-stream' }
    }
}

$root = (Resolve-Path '.').Path
Import-DotEnv (Join-Path $root '.env')

if ($Port -le 0) {
    $Port = if ($env:PORT) { [int]$env:PORT } else { 5500 }
}

if ([string]::IsNullOrWhiteSpace($HostName)) {
    $HostName = if ($env:HOST) { $env:HOST } else { '0.0.0.0' }
}

$publicHost = if ($env:PUBLIC_HOST) { $env:PUBLIC_HOST } else { Get-LocalIPv4 }
$localUrl = "http://localhost:$Port/"
$phoneUrl = "http://${publicHost}:$Port/"

$php = Get-Command php -ErrorAction SilentlyContinue
if ($php) {
    Write-Host "Serving '$root'" -ForegroundColor Green
    Write-Host "Local: $localUrl" -ForegroundColor Green
    Write-Host "Phone/tablet: $phoneUrl" -ForegroundColor Cyan
    Write-Host 'Make sure your phone and PC are on the same Wi-Fi. Press Ctrl+C to stop.' -ForegroundColor DarkGray
    & $php.Source -S "${HostName}:$Port" -t $root
    exit
}

$listenerHost = if ($HostName -eq '0.0.0.0') { '*' } else { $HostName }
$prefix = "http://${listenerHost}:$Port/"

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "Serving '$root'" -ForegroundColor Green
    Write-Host "Local: $localUrl" -ForegroundColor Green
    Write-Host "Phone/tablet: $phoneUrl" -ForegroundColor Cyan
    Write-Host 'Make sure your phone and PC are on the same Wi-Fi. Press Ctrl+C to stop.' -ForegroundColor DarkGray

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        try {
            $relative = [Uri]::UnescapeDataString($request.Url.AbsolutePath.TrimStart('/'))
            if ([string]::IsNullOrWhiteSpace($relative)) {
                $relative = 'index.html'
            }

            # Prevent path traversal
            $candidate = Join-Path $root ($relative -replace '/', '\\')
            $fullPath = (Resolve-Path -LiteralPath $candidate -ErrorAction SilentlyContinue)

            if (-not $fullPath) {
                $response.StatusCode = 404
                $bytes = [Text.Encoding]::UTF8.GetBytes('404 Not Found')
                $response.ContentType = 'text/plain; charset=utf-8'
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                continue
            }

            $fullPath = $fullPath.Path
            if (-not $fullPath.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
                $response.StatusCode = 403
                $bytes = [Text.Encoding]::UTF8.GetBytes('403 Forbidden')
                $response.ContentType = 'text/plain; charset=utf-8'
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                continue
            }

            if ((Get-Item -LiteralPath $fullPath).PSIsContainer) {
                $indexPath = Join-Path $fullPath 'index.html'
                if (Test-Path -LiteralPath $indexPath) {
                    $fullPath = $indexPath
                } else {
                    $response.StatusCode = 403
                    $bytes = [Text.Encoding]::UTF8.GetBytes('403 Forbidden')
                    $response.ContentType = 'text/plain; charset=utf-8'
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                    continue
                }
            }

            $response.StatusCode = 200
            $response.ContentType = Get-ContentType $fullPath
            $fileBytes = [IO.File]::ReadAllBytes($fullPath)
            $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
        } catch {
            $response.StatusCode = 500
            $bytes = [Text.Encoding]::UTF8.GetBytes('500 Internal Server Error')
            $response.ContentType = 'text/plain; charset=utf-8'
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } finally {
            $response.OutputStream.Close()
        }
    }
} finally {
    if ($listener) {
        $listener.Stop()
        $listener.Close()
    }
}
