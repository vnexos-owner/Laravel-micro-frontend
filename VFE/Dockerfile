FROM node:alpine
 
# Install pnpm globally via npm
RUN npm install -g pnpm
 
WORKDIR /app
 
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
 
COPY . .
RUN pnpm build           # outputs to /app/dist
 
# Keep the container running so the named volume stays alive
# and your Nginx container can read /app/dist
CMD ["tail", "-f", "/dev/null"]
