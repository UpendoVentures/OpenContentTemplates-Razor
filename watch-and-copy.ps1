$source = "C:\Work\Dnn.Modules\OpenContentTemplates-Razor\OpenContentTemplates-Razor"
$destination = "C:\Work\RunsOnUpendo\website\Portals\_default\OpenContent\Templates"

# Optional: file types to include
$includeExtensions = @(".cshtml", ".json", ".css", ".js", ".html", ".txt", ".xml", ".jpg", ".jpeg", ".png", ".gif", ".webp")

function Should-CopyFile {
    param (
        [string]$filePath
    )

    if (-not (Test-Path $filePath -PathType Leaf)) {
        return $false
    }

    $extension = [System.IO.Path]::GetExtension($filePath)
    return $includeExtensions -contains $extension.ToLower()
}

function Copy-ChangedFile {
    param (
        [string]$fullPath
    )

    try {
        if (-not (Should-CopyFile -filePath $fullPath)) {
            return
        }

        # Avoid copying temporary editor files
        $fileName = [System.IO.Path]::GetFileName($fullPath)
        if ($fileName.StartsWith("~")) { return }
        if ($fileName.EndsWith(".tmp")) { return }

        $relativePath = $fullPath.Substring($source.Length).TrimStart('\')
        $targetPath = Join-Path $destination $relativePath
        $targetFolder = Split-Path $targetPath -Parent

        if (-not (Test-Path $targetFolder)) {
            New-Item -ItemType Directory -Path $targetFolder -Force | Out-Null
        }

        # Small delay helps avoid issues while files are still being written
        Start-Sleep -Milliseconds 200

        Copy-Item -Path $fullPath -Destination $targetPath -Force

        Write-Host "[COPIED] $relativePath" -ForegroundColor Green
    }
    catch {
        Write-Host "[ERROR] $fullPath" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

function Rename-ChangedFile {
    param (
        [string]$oldFullPath,
        [string]$newFullPath
    )

    try {
        $oldRelativePath = $oldFullPath.Substring($source.Length).TrimStart('\')
        $newRelativePath = $newFullPath.Substring($source.Length).TrimStart('\')

        $oldTargetPath = Join-Path $destination $oldRelativePath
        $newTargetPath = Join-Path $destination $newRelativePath
        $newTargetFolder = Split-Path $newTargetPath -Parent

        if (-not (Test-Path $newTargetFolder)) {
            New-Item -ItemType Directory -Path $newTargetFolder -Force | Out-Null
        }

        if (Test-Path $oldTargetPath) {
            Move-Item -Path $oldTargetPath -Destination $newTargetPath -Force
            Write-Host "[RENAMED] $oldRelativePath -> $newRelativePath" -ForegroundColor Yellow
        }
        elseif (Test-Path $newFullPath) {
            Copy-ChangedFile -fullPath $newFullPath
        }
    }
    catch {
        Write-Host "[ERROR RENAME] $newFullPath" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

Write-Host "Watching source folder:" -ForegroundColor Cyan
Write-Host $source -ForegroundColor White
Write-Host ""
Write-Host "Copying to destination:" -ForegroundColor Cyan
Write-Host $destination -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop." -ForegroundColor Magenta
Write-Host ""

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $source
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]'FileName, LastWrite, DirectoryName'

$createdAction = Register-ObjectEvent $watcher Created -Action {
    Copy-ChangedFile -fullPath $Event.SourceEventArgs.FullPath
}

$changedAction = Register-ObjectEvent $watcher Changed -Action {
    Copy-ChangedFile -fullPath $Event.SourceEventArgs.FullPath
}

$renamedAction = Register-ObjectEvent $watcher Renamed -Action {
    Rename-ChangedFile -oldFullPath $Event.SourceEventArgs.OldFullPath -newFullPath $Event.SourceEventArgs.FullPath
}

try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    Unregister-Event -SourceIdentifier $createdAction.Name -ErrorAction SilentlyContinue
    Unregister-Event -SourceIdentifier $changedAction.Name -ErrorAction SilentlyContinue
    Unregister-Event -SourceIdentifier $renamedAction.Name -ErrorAction SilentlyContinue
    $watcher.Dispose()
}