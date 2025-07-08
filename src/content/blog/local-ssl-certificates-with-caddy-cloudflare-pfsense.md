---
title: "Local SSL Certificates with Caddy, Cloudflare, and pfSense"
description: "How I set up real SSL certificates for local services using Caddy's DNS challenge with Cloudflare and pfSense host overrides"
date: 2025-01-08
tags: ["caddy", "cloudflare", "pfsense", "ssl", "homelab", "dns"]
---

## Introduction

I was getting tired of browser warnings every time I accessed my local services. Self-signed certificates work, but those "Your connection is not private" warnings get old fast. I wanted real SSL certificates for my homelab without exposing anything to the internet.

After some research, I found a solution using Caddy's DNS challenge feature with Cloudflare. Now all my local services like `nas.yourdomain.net`, `proxmox.yourdomain.net`, and `vpn.yourdomain.net` have proper SSL certificates that browsers actually trust.

Here's how I set it up using my existing infrastructure:
- **Caddy server** for reverse proxy and certificate management
- **Cloudflare** for DNS hosting and API access
- **pfSense** for local DNS resolution

## Step 1: Adding the Cloudflare Plugin to Caddy

First, I needed to add the Cloudflare DNS plugin to my Caddy installation:

```bash
caddy add-package github.com/caddy-dns/cloudflare
```

This plugin is what makes the magic happen - it lets Caddy use Cloudflare's DNS API to complete the DNS-01 ACME challenge. The beauty is that certificates get issued without needing to expose ports 80 or 443 to the internet.

## Step 2: Cloudflare DNS Configuration

In Cloudflare, I configured my domain to point to my local Caddy server. This part is pretty straightforward:

### A Record
```
A
yourdomain.net
192.168.xx.xx
DNS only - reserved IP
```

### Wildcard CNAME
```
CNAME
*
yourdomain.net
DNS only
```

The wildcard CNAME is handy - it means any subdomain like `nas.yourdomain.net` or `vpn.yourdomain.net` automatically resolves to the same IP as the main domain.

### API Token Creation

I created a Cloudflare API token with these permissions:
- **Zone:Zone:Read** - to read zone information
- **Zone:DNS:Edit** - to create DNS challenge records
- **Include: Specific zone** - limited to just my domain

The token is scoped to only the zone I need, following the principle of least privilege.

## Step 3: pfSense Host Overrides

Here's where I got stuck initially, and most tutorials don't mention this: even though Cloudflare resolves your domain to your local IP, you still need pfSense to handle local DNS resolution properly.

I had to add a host override in pfSense for each service, but they all point to the same place - my Caddy server:

**Services > DNS Resolver > Host Overrides**

Examples (all pointing to your Caddy server):
- **Host**: `nas` **Domain**: `yourdomain.net` **IP**: `192.168.xx.xx`
- **Host**: `proxmox` **Domain**: `yourdomain.net` **IP**: `192.168.xx.xx`
- **Host**: `vpn` **Domain**: `yourdomain.net` **IP**: `192.168.xx.xx`

Without these overrides, your local clients might try to resolve through external DNS and get confused about routing. Trust me, I learned this the hard way.

## Step 4: Caddy Configuration

Here's my complete Caddyfile. I'm using a wildcard certificate to cover all my subdomains:

```caddyfile
*.yourdomain.net {
    tls {
        dns cloudflare apikeyapikeyapikeyapikey
    }

    @vpn host vpn.yourdomain.net
    handle @vpn {
        reverse_proxy https://192.168.11.xx.xx:3000 {
            transport http {
                tls_insecure_skip_verify
            }
        }
    }

    @nas host nas.yourdomain.net
    handle @nas {
        reverse_proxy https://192.168.11.xx.xx:5001 {
            transport http {
                tls_insecure_skip_verify
            }
        }
    }

    @vm host vm.yourdomain.net proxmox.yourdomain.net
    handle @vm {
        reverse_proxy https://192.168.xx.xx:8006 {
            transport http {
                tls_insecure_skip_verify
            }
        }
    }

    handle {
        respond "Welcome to yourdomain.net local network" 404
    }
}
```

### Key Points:

1. **Wildcard certificate**: `*.yourdomain.net` covers all subdomains with one certificate
2. **DNS challenge**: `dns cloudflare apikeyapikeyapikeyapikey` uses the API token for validation
3. **Service routing**: Each `@service` matcher handles different subdomains
4. **TLS skip verify**: Since backend services use self-signed certs or HTTP

## Step 5: Environment Variables

You'll want to set your actual Cloudflare API token in the Caddyfile where I have `apikeyapikeyapikeyapikey`. You can either put it directly in the file or use an environment variable if you prefer.

## How It All Works Together

When you browse to `https://nas.yourdomain.net`, here's what happens:

1. **Your browser** asks pfSense to resolve `nas.yourdomain.net`
2. **pfSense** returns `192.168.xx.xx` (your Caddy server) thanks to the host override
3. **Caddy** receives the HTTPS request and matches it to the `@nas` handler
4. **Certificate magic** happens automatically via Cloudflare DNS challenge
5. **Request gets forwarded** to your actual NAS at the real IP

## Adding New Services

Adding a new service is easy once you have this setup:

1. **Add a new section to your Caddyfile**:
```caddyfile
@newservice host newservice.yourdomain.net
handle @newservice {
    reverse_proxy http://192.168.11.20:8080
}
```

2. **Add a host override in pfSense** (pointing to Caddy server):
   - Host: `newservice`
   - Domain: `yourdomain.net` 
   - IP: `192.168.xx.xx` (your Caddy server)

3. **Restart Caddy** and you're done

## Why This Setup Rocks

- **No more browser warnings** - real SSL certificates that just work
- **Set it and forget it** - automatic renewal via Let's Encrypt
- **Nothing exposed to the internet** - no port forwarding needed
- **Unlimited subdomains** - wildcard certificate covers everything
- **Works locally** - no weird DNS issues

## When Things Go Wrong

**Certificates not working?**
- Double-check your Cloudflare API token has the right permissions
- Make sure the token can access your specific zone
- Verify your pfSense host overrides are set up correctly

**DNS weirdness?**
- Turn off DNS over HTTPS in your browser - it bypasses local DNS
- Check that pfSense DNS resolver is actually running
- Make sure you have host overrides for each subdomain (all pointing to Caddy)

**Can't reach your services?**
- Verify your backend services are actually running
- Double-check IP addresses match between Caddyfile and reality
- Try accessing the service directly by IP first

## Final Thoughts

This setup has been rock solid for me. I get real SSL certificates for all my local services without exposing anything to the internet, and certificates renew automatically. Once it's working, you basically never have to think about it again.

The initial setup takes a bit of work, but it's so worth it to never see those browser certificate warnings again.