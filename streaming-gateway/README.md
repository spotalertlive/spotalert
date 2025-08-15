# SpotAlert Streaming Gateway (RTSP → HLS)

Deploy on Railway/Fly/Render. Set env:  
- RTSP_URLS = comma-separated RTSP URLs (no spaces)

HLS will be available at:
- http://<gateway-host>/hls/cam1.m3u8
- http://<gateway-host>/hls/cam2.m3u8
Use those URLs when adding Cameras in the Dashboard.
