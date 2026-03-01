import http.server
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
handler = http.server.SimpleHTTPRequestHandler
server = http.server.HTTPServer(("", 8080), handler)
print(f"Serving on http://localhost:8080")
server.serve_forever()
