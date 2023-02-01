GH_ID=$1
if [[ $GH_ID != "nightly" ]]; then
  sed -i "s~<!-- Global Event Tracking -->~<script async src='https://www.googletagmanager.com/gtag/js?id=$GH_ID'></script>\n<script>\nwindow.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '$GH_ID');\n</script>~g" ./src/index.html
fi