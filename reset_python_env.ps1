# Deactivate virtual environment if active
if (Test-Path ".\.venv\Scripts\deactivate.ps1") {
    .\.venv\Scripts\deactivate.ps1
}

# Remove existing virtual environment
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue ".venv"

# Remove VS Code Python cache
$vscodeCache = "$env:APPDATA\Code\User\workspaceStorage"
if (Test-Path $vscodeCache) {
    Get-ChildItem $vscodeCache -Directory | ForEach-Object {
        Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Remove Python cache files
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "**/__pycache__"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "**/.pytest_cache"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "**/.mypy_cache"

# Create new virtual environment
python -m venv .venv

# Activate new virtual environment
.\.venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

Write-Host "Python environment has been reset successfully!"
Write-Host "Please restart VS Code and select the Python interpreter from .venv/Scripts/python.exe"