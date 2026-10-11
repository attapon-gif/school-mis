[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$filePath = Join-Path $PSScriptRoot "..\PP5-MY-2569.xlsb"
$resolvedPath = (Resolve-Path $filePath).Path
Write-Host "Opening Excel workbook: $resolvedPath"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open($resolvedPath)
    Write-Host "Workbook opened successfully."
    Write-Host "Total Sheets: $($wb.Sheets.Count)"
    
    $sheetList = @()
    for ($i = 1; $i -le $wb.Sheets.Count; $i++) {
        $sh = $wb.Sheets.Item($i)
        $sheetList += [PSCustomObject]@{
            Index = $i
            Name = $sh.Name
            Visible = $sh.Visible
        }
    }
    
    $sheetList | Format-Table -AutoSize
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
