$filePath = 'src/components/LoginModal.tsx'

# Read the entire file
$content = Get-Content $filePath -Raw -Encoding UTF8

# Find and replace the exact corrupted line
# We'll replace just the toast.success line with special characters
$oldLine = 'toast.success("ÖĐ röđ misc dã nÖĐt à nÖĐẗ ÖĐ!");'
$newLine = 'toast.success("Profil mis à jour avec succès !");
        
        // Update localStorage immediately for synchronization
        localStorage.setItem("currentUser", JSON.stringify(result.user));'

# Use simple string replacement on the specific line
if ($content -match [regex]::Escape($oldLine)) {
    Write-Host "Found the corrupted line, replacing..."
    $content = $content -replace [regex]::Escape($oldLine), $newLine
    Set-Content $filePath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "File updated successfully!"
} else {
    Write-Host "Pattern not found, trying alternative approach..."
    # Alternative: Replace using byte-based approach
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
    $content = [System.Text.Encoding]::UTF8.GetString($bytes)
    $content = $content -replace 'toast\.success\("ÖĐ.*?"\);', 'toast.success("Profil mis à jour avec succès !");'`n'        // Update localStorage immediately for synchronization'`n'        localStorage.setItem("currentUser", JSON.stringify(result.user));'
    Set-Content $filePath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "File updated with alternative method"
}
