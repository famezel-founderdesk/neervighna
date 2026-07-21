import re

index_file = r'c:\n-final\Pages\Pages\Pages\Neervighna Final\Page\index.html'
footer_file = r'c:\n-final\Pages\Pages\Pages\Neervighna Final\Page\footer.html'

with open(index_file, 'r', encoding='utf-8') as f:
    idx = f.read()

with open(footer_file, 'r', encoding='utf-8') as f:
    ftr = f.read()

# Regex to remove the DOMContentLoaded fetch block since it's now broken and useless
idx = re.sub(r'<script>\s*document\.addEventListener\(\'DOMContentLoaded\', \(\) => \{\s*fetch\(\'\.\./footer\.html\'\).*?\}\);\s*\}\);\s*</script>', '', idx, flags=re.DOTALL)

# Inject footer.html right before </body>
idx = idx.replace('</body>', ftr + '\n</body>')

with open(index_file, 'w', encoding='utf-8') as f:
    f.write(idx)

print("Footer injected successfully")
