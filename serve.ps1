param(
    [int]$Port = 5500
)

$ErrorActionPreference = 'Stop'

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
$prefix = "http://localhost:$Port/"

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "Serving '$root' at $prefix" -ForegroundColor Green
    Write-Host 'Press Ctrl+C to stop.' -ForegroundColor DarkGray

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
