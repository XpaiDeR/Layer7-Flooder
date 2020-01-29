# Layer7-Flooder
NodeJS web requests flooder, Sends massive amounts of requests to a URL with custom features and bypasses for JS challenges, it uses proxies. MADE FOR TESTING PURPOSES

# The module contains several bypasses of firewalls:
* Cloudflare (JS challenge - UAM, Captcha partly)
* Stormwall
* BlazingFast
* OVH UAM
* PipeGuard
* DDoS-Guard (JS challenge)

The module can work with CNC controller aswell, But can be run just by a command either.
# Requirements:
proxies.txt - file that includes proxy list.
ua.txt - file that contains list of useragents to use.

# How to use?
node method.js [URL] [DURATION(SECONDS)] [MODE]
- Example:
node method.js https://example.com 120 request
