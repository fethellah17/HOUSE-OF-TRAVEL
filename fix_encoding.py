#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os

file_path = 'src/components/LoginModal.tsx'

# Read the file in UTF-8
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the corrupted message
# Since we can't match the exact corrupted bytes easily, we'll use a regex pattern
import re

# Pattern to match the toast.success line with any garbled content
pattern = r'toast\.success\("[^"]*"\);\s+\n\s+// Trigger a custom event'

replacement = '''toast.success("Profil mis à jour avec succès !");
        
        // Update localStorage immediately for synchronization
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        
        // Trigger a custom event'''

content = re.sub(pattern, replacement, content)

# Write back with UTF-8 encoding
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("File fixed successfully with UTF-8 encoding!")
