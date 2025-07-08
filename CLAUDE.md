# Project Knowledge - haveman-dot-ca Blog

## Blog Writing Style & Tone
- **Conversational and personal** - use "I" statements, share personal experiences
- **Casual language** - avoid corporate/formal language like "follows best practices for security and performance"
- **Practical focus** - explain "why" behind steps, include troubleshooting from real experience
- **Relatable problems** - start with frustrations/pain points before solutions
- **Section headers** - use casual language like "Why This Setup Rocks" instead of "Benefits"
- **Personal touches** - phrases like "Trust me, I learned this the hard way"

## Technical Infrastructure
### Actual Budget Setup
- **Community Scripts** - https://community-scripts.github.io/ProxmoxVE/scripts?id=actualbudget
- **Build from source** - https://actualbudget.org/docs/install/build-from-source#linux-systemd-setup
- **Docker image** - actualbudget/actual-server:latest on port 5006
- **Update method for Community Scripts** - run same command in container shell, not Proxmox shell

### Caddy + Cloudflare + pfSense Setup
- **Caddy DNS challenge** - uses Cloudflare API to get real SSL certs without exposing ports
- **Wildcard certificates** - `*.yourdomain.net` covers all subdomains
- **pfSense host overrides** - ALL point to Caddy server IP, not individual service IPs
- **Caddy reverse proxy** - routes requests to actual services based on subdomain matching

### Blog Cross-References
- Caddy setup guide: `/blog/caddy-pfsense-cloudflare-setup/`
- Proxmox installation: `/blog/how-i-installed-proxmox-on-my-old-intel-nuc`
- Standard Notes self-hosting: `/blog/self-host-standard-notes`

## Content Creation Process
1. Research technical details first (use Context7, official docs, web search)
2. Write in conversational tone matching existing blog posts
3. Include personal experience and troubleshooting tips
4. Use generic examples (yourdomain.net, 192.168.xx.xx) for templates
5. Avoid overly technical language - explain concepts simply

## File Structure
- Blog posts: `/src/content/blog/`
- Use `.md` for simple posts, `.mdx` for posts with components

## Useful Commands
- Lint/typecheck commands should be run after changes if available
- Check README or search codebase for testing approach
- Never commit changes unless explicitly requested