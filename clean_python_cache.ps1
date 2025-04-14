# Clean Python cache files
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "**/__pycache__"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "**/.pytest_cache"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "**/.mypy_cache"

# Clean VS Code Python cache
$vscodeCache = "$env:APPDATA\Code\User\workspaceStorage"
if (Test-Path $vscodeCache) {
    Get-ChildItem $vscodeCache -Directory | ForEach-Object {
        Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Cache cleaned successfully!"