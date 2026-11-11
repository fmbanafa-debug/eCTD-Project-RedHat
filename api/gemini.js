{
"version": 2,
"public": true,
"headers": [
{
"source": "/(.)",
"headers": [
{
"key": "X-Frame-Options",
"value": "ALLOWALL"
},
{
"key": "Access-Control-Allow-Origin",
"value": ""
}
]
}
],
"routes": [
{
"src": "/api/gemini",
"dest": "/api/gemini.js"
},
{
"src": "/(.*)",
"dest": "/$1"
}
]
}
