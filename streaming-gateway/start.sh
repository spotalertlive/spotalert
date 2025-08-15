#!/bin/sh
set -e
mkdir -p /var/www/hls

# RTSP_URLS="rtsp://user:pass@10.0.0.10:554/stream1,rtsp://user:pass@10.0.0.11/stream1"
IFS=',' read -r -a urls <<EOF
${RTSP_URLS:-}
EOF

i=1
for u in "${urls[@]}"; do
  [ -z "$u" ] && continue
  ffmpeg -rtsp_transport tcp -i "$u" -an -c:v libx264 -preset veryfast -tune zerolatency \
    -f hls -hls_time 2 -hls_list_size 6 -hls_flags delete_segments+append_list \
    "/var/www/hls/cam${i}.m3u8" >/dev/null 2>&1 &
  i=$((i+1))
done

nginx -g 'daemon off;'
