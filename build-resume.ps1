# Rebuilds Harshad_Chaudhary_DotNet_Resume.pdf from resume.html.
# Run this after editing resume.html so the downloadable PDF stays in sync.
#
#   powershell -ExecutionPolicy Bypass -File build-resume.ps1

$ErrorActionPreference = "Stop"

$root   = Split-Path -Parent $MyInvocation.MyCommand.Path
$source = Join-Path $root "resume.html"
$final  = Join-Path $root "Harshad_Chaudhary_DotNet_Resume.pdf"
$temp   = Join-Path $env:TEMP "resume_build.pdf"

$chrome = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $chrome) { throw "Chrome not found. Install Chrome, or open resume.html and use Ctrl+P > Save as PDF." }
if (-not (Test-Path $source)) { throw "resume.html not found next to this script." }

if (Test-Path $temp) { Remove-Item $temp -Force }

# Notes on the flags:
#   --headless           old headless; the new one silently produces nothing here
#   --no-pdf-header-footer   drops Chrome's date / URL / page-number stamps
#   no --virtual-time-budget; it makes the render return an empty file
& $chrome --headless --disable-gpu --no-pdf-header-footer `
    --print-to-pdf="$temp" ("file:///" + $source.Replace("\", "/")) | Out-Null

Start-Sleep -Milliseconds 2500

if (-not (Test-Path $temp)) { throw "Chrome produced no PDF. Open resume.html and print to PDF manually instead." }

Copy-Item $temp $final -Force
Remove-Item $temp -Force

Write-Host "Built $final ($([math]::Round((Get-Item $final).Length / 1KB)) KB)"
