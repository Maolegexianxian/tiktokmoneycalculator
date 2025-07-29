# 🚀 Production Deployment Guide

## Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] Docker and Docker Compose installed
- [ ] Minimum 2GB RAM available
- [ ] Port 80 and 443 available (or configure different ports)
- [ ] SSL certificates ready (optional, for HTTPS)

### ✅ Environment Variables
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_URL` - Your production domain
- [ ] `NEXTAUTH_SECRET` - Secure random string (32+ characters)
- [ ] `POSTGRES_PASSWORD` - Database password

### ✅ Configuration Files
- [ ] `.env.production` configured
- [ ] `docker-compose.prod.yml` reviewed
- [ ] `nginx.conf` customized for your domain
- [ ] SSL certificates placed in `./ssl/` directory (if using HTTPS)

## Deployment Steps

### Option 1: Automated Deployment

#### Linux/macOS:
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Windows PowerShell:
```powershell
.\deploy.ps1
```

### Option 2: Manual Deployment

1. **Set Environment Variables**
```bash
export DATABASE_URL="postgresql://postgres:yourpassword@postgres:5432/tiktok_calculator"
export NEXTAUTH_URL="https://yourdomain.com"
export NEXTAUTH_SECRET="your-very-secure-secret-key"
export POSTGRES_PASSWORD="your-database-password"
```

2. **Build and Deploy**
```bash
# Clean previous builds
docker-compose -f docker-compose.prod.yml down --remove-orphans
docker system prune -f

# Build and start
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

3. **Verify Deployment**
```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# Run health checks
./scripts/health-check.sh

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Post-Deployment Verification

### ✅ Service Health
- [ ] All containers running: `docker-compose -f docker-compose.prod.yml ps`
- [ ] Health endpoint responding: `curl http://localhost/api/health`
- [ ] Main page loading: `curl http://localhost/`
- [ ] Database connection working
- [ ] No error logs in application

### ✅ Performance Tests
- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] Calculator functionality working
- [ ] Form submissions successful

### ✅ Security Checks
- [ ] Security headers present
- [ ] Rate limiting working
- [ ] CORS configured correctly
- [ ] No sensitive data in logs

## Monitoring and Maintenance

### Daily Checks
```bash
# Health check
./scripts/health-check.sh

# Check disk space
docker system df

# View recent logs
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Weekly Maintenance
```bash
# Update images
docker-compose -f docker-compose.prod.yml pull

# Clean unused resources
docker system prune -f

# Backup database
docker exec postgres pg_dump -U postgres tiktok_calculator > backup_$(date +%Y%m%d).sql
```

## Troubleshooting

### Common Issues

#### 1. Build Fails
```bash
# Check Docker resources
docker system df
docker system prune -f

# Rebuild without cache
docker-compose -f docker-compose.prod.yml build --no-cache
```

#### 2. Database Connection Issues
```bash
# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres

# Reset database
docker-compose -f docker-compose.prod.yml down
docker volume rm tiktokmoneycalculator_postgres_data
docker-compose -f docker-compose.prod.yml up -d
```

#### 3. Application Not Responding
```bash
# Check application logs
docker-compose -f docker-compose.prod.yml logs app

# Restart application
docker-compose -f docker-compose.prod.yml restart app
```

### Log Locations
- Application logs: `docker-compose -f docker-compose.prod.yml logs app`
- Database logs: `docker-compose -f docker-compose.prod.yml logs postgres`
- Nginx logs: `docker-compose -f docker-compose.prod.yml logs nginx`

## Scaling and Performance

### Horizontal Scaling
To scale the application:
```bash
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

### Performance Optimization
- Enable Redis for session storage
- Configure CDN for static assets
- Implement database connection pooling
- Add application-level caching

## Security Hardening

### Additional Security Measures
1. Configure firewall rules
2. Set up SSL/TLS certificates
3. Implement log monitoring
4. Configure backup strategies
5. Set up monitoring and alerting

### SSL Configuration
Add to `nginx.conf`:
```nginx
server {
    listen 443 ssl;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    # ... rest of configuration
}
```

## Support

For deployment issues:
1. Check the logs first
2. Review this deployment guide
3. Run the health check script
4. Check Docker and system resources
5. Verify environment variables are set correctly
