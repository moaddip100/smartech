$wc = New-Object System.Net.WebClient
$wc.Credentials = New-Object System.Net.NetworkCredential('u727091322','586793100qQ!')
try {
  $data = $wc.DownloadString('ftp://195.179.239.193/public_html/')
  Write-Output $data
} catch {
  Write-Error $_.Exception.Message
}