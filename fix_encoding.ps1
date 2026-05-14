$filePath = 'src/components/LoginModal.tsx'

# Read file
$content = Get-Content $filePath -Raw -Encoding UTF8

# Replace the corrupted message with clean French text
# Using a pattern that captures the garbled text
$content = $content -replace '(?ms)toast\.success\("[^"]*ÖĐ[^"]*"\);\s+// Trigger a custom event', 'toast.success("Profil mis à jour avec succès !");
        
        // Update localStorage immediately for synchronization
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        
        // Trigger a custom event'

# Save with UTF-8 encoding
Set-Content $filePath -Value $content -Encoding UTF8 -NoNewline

Write-Host "File fixed successfully!"
