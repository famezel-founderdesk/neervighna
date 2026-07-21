import os

index_file = r'c:\n-final\Pages\Pages\Pages\Neervighna Final\Page\index.html'
header_file = r'c:\n-final\Pages\Pages\Pages\Neervighna Final\Page\header.html'

with open(index_file, 'r', encoding='utf-8') as f:
    idx = f.read()

with open(header_file, 'r', encoding='utf-8') as f:
    hdr = f.read()

fetch_script = """            fetch('../header.html')
                .then(res => res.text())
                .then(data => {
                    document.body.insertAdjacentHTML('afterbegin', data);
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, 'text/html');
                    const scriptTag = doc.querySelector('script');
                    if (scriptTag) {
                        const scriptElement = document.createElement('script');
                        scriptElement.textContent = scriptTag.textContent;
                        document.head.appendChild(scriptElement);
                    }
                    if (window.initHeader) window.initHeader();
                });"""

if fetch_script in idx:
    idx = idx.replace(fetch_script, "")
else:
    print("Could not find fetch script exact match. Continuing...")

body_tag = '<body class="font-body overflow-hidden">'
if body_tag in idx:
    idx = idx.replace(body_tag, body_tag + '\n' + hdr + '\n')
else:
    print("Could not find body tag!")

with open(index_file, 'w', encoding='utf-8') as f:
    f.write(idx)

print("Insertion complete.")
