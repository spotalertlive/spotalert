FROM alpine:3.19
RUN apk add --no-cache ffmpeg nginx
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY start.sh /start.sh
RUN mkdir -p /var/www/hls && chmod +x /start.sh
EXPOSE 80
CMD ["/start.sh"]
