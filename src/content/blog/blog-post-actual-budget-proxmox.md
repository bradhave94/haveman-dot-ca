---
title: "Deploying Actual Budget on Proxmox with Caddy Reverse Proxy"
description: "A complete guide to self-hosting Actual Budget on Proxmox with automatic SSL and secure access via Caddy"
date: 2024-07-08
tags: ["proxmox", "caddy", "actual-budget", "self-hosting", "docker", "finance", "budgeting"]
---

In this guide, I'll walk you through deploying [Actual Budget](https://actualbudget.org/), a fantastic local-first personal finance app, on a Proxmox virtual machine with Caddy as a reverse proxy to serve it securely at `money.domain.com`.

## What is Actual Budget?

Actual Budget is a local-first personal finance app that puts you in control of your financial data. Unlike cloud-based alternatives, it runs entirely on your own infrastructure, ensuring your sensitive financial information never leaves your control. Originally created by one developer and later open-sourced, it offers budgeting capabilities similar to YNAB but with the added security of self-hosting.

## Prerequisites

- Proxmox VE server
- A domain name (we'll use `money.domain.com` as an example)
- Basic knowledge of Linux command line
- Port 80 and 443 accessible from the internet

**For Option A (Community Scripts):** No additional prerequisites needed - the script handles everything automatically.

**For Option B (Docker-based):** Docker and Docker Compose installed on your VM

## Step 1: Create a Proxmox VM

You have two options for setting up Actual Budget on Proxmox:

### Option A: Automated Setup with Community Scripts (Recommended)

The easiest way is to use the [Proxmox Helper Scripts](https://community-scripts.github.io/ProxmoxVE/scripts?id=actualbudget) which automates the entire VM creation and Actual Budget installation process:

1. Run the Actual Budget script from the Proxmox Helper Scripts collection
2. The script will automatically create and configure a VM with Actual Budget installed
3. This uses the build-from-source installation method following the [Linux systemd setup](https://actualbudget.org/docs/install/build-from-source#linux-systemd-setup)

**Benefits of Option A:**
- Everything is automated - just run the script and you're done
- Uses the official build-from-source method
- Starts automatically when the VM boots

### Option B: Manual Setup (Docker-based)

If you prefer manual control or want to use Docker with Caddy reverse proxy, create a new VM manually:

1. Create a new VM with Debian 12 (recommended)
2. Allocate 2 vCPU, 2GB RAM, and 4GB storage
3. Configure network settings to bridge to your main network
4. Install Docker and Docker Compose on the VM

**Benefits of Option B:**
- You control everything
- Easy to customize
- Uses Docker if you're already familiar with it

## Step 2: Set Up Actual Budget with Docker Compose (Option B Only)

**Note:** If you used the Community Scripts in Option A, your Actual Budget installation is already complete and running. You can skip to Step 3 to configure Caddy reverse proxy. The following Docker setup steps are only needed if you chose the manual Docker-based setup in Option B.

Create a directory for your Actual Budget deployment:

```bash
mkdir ~/actual-budget
cd ~/actual-budget
```

Create a `docker-compose.yml` file:

```yaml
services:
  caddy:
    container_name: caddy
    image: caddy:alpine
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - ./caddy/data:/data
      - ./caddy/config:/config
    ports:
      - "80:80"
      - "443:443"
    restart: unless-stopped

  actual-server:
    image: actualbudget/actual-server:latest
    container_name: actual_server
    restart: unless-stopped
    ports:
      - "5006:5006"
    volumes:
      - ./actual-data:/data
```

## Step 3: Configure Caddy for Reverse Proxy

Create a `Caddyfile` for reverse proxy configuration:

```caddyfile
money.domain.com {
    reverse_proxy https://192.168.xx.xx:5006 {
        transport http {
            tls_insecure_skip_verify
        }
    }
}
```

This setup:
- Gets SSL certificates automatically from Let's Encrypt
- Connects to Actual Budget via HTTPS (ignores self-signed cert warnings)
- Works with both installation options
- Forwards requests to your Actual Budget server on port 5006

**For more detailed information on setting up Caddy with pfSense, Cloudflare, and comprehensive infrastructure setup, see my [Caddy, pfSense, and Cloudflare Setup guide](/blog/caddy-pfsense-cloudflare-setup/).**

## Step 4: Deploy the Stack (Option B Only)

Create the necessary directories and start the services:

```bash
# Create directories for persistent data
mkdir -p actual-data caddy/data caddy/config

# Start the services
docker compose up -d
```

## Step 5: Verify Deployment (Option B Only)

Check that both services are running:

```bash
docker compose ps
```

You should see both `caddy` and `actual_server` containers running.

## Step 6: Access Your Actual Budget Instance

1. Point your domain `money.domain.com` to your Proxmox server's IP address
2. Navigate to `https://money.domain.com` in your browser
3. Caddy will automatically obtain an SSL certificate from Let's Encrypt
4. Complete the initial setup of Actual Budget

## Step 7: Maintenance and Updates

### For Option A (Community Scripts Installation)

To update Actual Budget to the latest version when using the Community Scripts installation:

1. Access your VM's shell/terminal
2. Run the same Community Scripts command used for initial installation:

```bash
bash -c "$(wget -qLO - https://github.com/community-scripts/ProxmoxVE/raw/main/ct/actualbudget.sh)"
```

**Note:** Run this command in the container shell, not the Proxmox shell.

### For Option B (Docker Installation)

To update Actual Budget to the latest version:

```bash
cd ~/actual-budget
docker compose pull
docker compose up -d
```

## Security Considerations

1. **Firewall**: Ensure only ports 80 and 443 are accessible from the internet
2. **Backups**: Regularly backup the `actual-data` directory
3. **Updates**: Keep both Actual Budget and Caddy updated
4. **Access Control**: Consider adding authentication at the Caddy level if needed

## Backup Strategy

Your financial data is stored in the `actual-data` directory. Set up automated backups:

```bash
# Create a backup script
#!/bin/bash
tar -czf actual-backup-$(date +%Y%m%d).tar.gz actual-data/
```

## Troubleshooting

### Common Issues

1. **SSL Certificate Issues**: Ensure your domain points to the correct IP and ports 80/443 are open
2. **Container Communication**: Both containers must be on the same Docker network (default with docker-compose)
3. **Data Persistence**: Verify the `actual-data` volume is properly mounted

### Useful Commands

```bash
# View logs
docker compose logs -f

# Restart services
docker compose restart

# Stop services
docker compose down
```

## Conclusion

You now have a fully functional Actual Budget instance running on Proxmox with automatic SSL certificate management via Caddy. This setup provides:

- **Security**: SSL encryption and local data storage
- **Reliability**: Automatic container restart policies
- **Ease of maintenance**: Simple updates via Docker Compose
- **Performance**: Efficient reverse proxy with compression

Your financial data remains under your complete control while being accessible from anywhere via your custom domain. The combination of Proxmox's virtualization capabilities, Docker's containerization, and Caddy's automatic HTTPS makes this a robust and maintainable solution for self-hosting your personal finance management.

Remember to regularly backup your data and keep your system updated for optimal security and performance.