[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$filePath = Join-Path $PSScriptRoot "..\PP5-MY-2569.xlsb"
$resolvedPath = (Resolve-Path $filePath).Path

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open($resolvedPath)
    
    $targetSheets = @("Cover", "Main", "ScoreTerm", "ScoreVicha", "Time", "Attib", "Read", "PP6", "Publish", "Student")
    
    foreach ($sheetName in $targetSheets) {
        $sh = $null
        try {
            $sh = $wb.Sheets.Item($sheetName)
        } catch {}
        
        if ($sh) {
            Write-Host "=================================================="
            Write-Host "SHEET: $sheetName (UsedRange: $($sh.UsedRange.Address()))"
            Write-Host "=================================================="
            
            # Print first 25 rows and first 15 columns of non-empty cells
            $maxR = [Math]::Min(35, $sh.UsedRange.Rows.Count)
            $maxC = [Math]::Min(20, $sh.UsedRange.Columns.Count)
            
            for ($r = 1; $r -le $maxR; $r++) {
                $rowVals = @()
                $hasVal = $false
                for ($c = 1; $c -le $maxC; $c++) {
                    $val = $sh.Cells.Item($r, $c).Text
                    if ($val) { $hasVal = $true }
                    $rowVals += "[$c]:" + ($val -replace "\s+", " ").Trim()
                }
                if ($hasVal) {
                    Write-Host "Row $r -> " ($rowVals -join " | ")
                }
            }
            Write-Host "`n"
        }
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
