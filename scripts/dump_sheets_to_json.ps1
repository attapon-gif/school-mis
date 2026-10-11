[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$filePath = Join-Path $PSScriptRoot "..\PP5-MY-2569.xlsb"
$resolvedPath = (Resolve-Path $filePath).Path
$outDir = Join-Path $PSScriptRoot "pp5_analysis"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open($resolvedPath)
    
    $sheets = @("Cover", "Main", "Index", "ScoreTerm", "ScoreVicha", "Time", "Attib", "Read", "PP6", "Publish")
    
    foreach ($name in $sheets) {
        $sh = $null
        try { $sh = $wb.Sheets.Item($name) } catch {}
        if (-not $sh) { continue }
        
        $outFile = Join-Path $outDir "$($name).txt"
        $lines = @()
        $lines += "=== SHEET: $name ==="
        
        $usedR = $sh.UsedRange
        $rowCount = [Math]::Min(55, $usedR.Rows.Count)
        $colCount = [Math]::Min(35, $usedR.Columns.Count)
        
        for ($r = 1; $r -le $rowCount; $r++) {
            $rowArr = @()
            $hasData = $false
            for ($c = 1; $c -le $colCount; $c++) {
                $cellVal = $sh.Cells.Item($r, $c).Text
                if ($cellVal) { 
                    $hasData = $true
                    $rowArr += "Col${c}: " + ($cellVal -replace "\r|\n", " ").Trim()
                }
            }
            if ($hasData) {
                $lines += "R$r -> " + ($rowArr -join " | ")
            }
        }
        
        [System.IO.File]::WriteAllLines($outFile, $lines, [System.Text.Encoding]::UTF8)
        Write-Host "Exported sheet $name to $outFile"
    }
}
catch {
    Write-Error $_
}
finally {
    if ($wb) { $wb.Close($false) }
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
