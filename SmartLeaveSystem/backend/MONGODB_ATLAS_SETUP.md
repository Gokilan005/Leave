## MongoDB Atlas Setup Instructions

### Current Status:
- ✓ Local MongoDB: Successfully configured and seeded with 9 users
- ✓ Backend configured with local MongoDB URI
- ✓ Collections created: Users and LeaveRequests
- ⚠ MongoDB Atlas: Awaiting configuration

### MongoDB Atlas Authentication Issue:

The connection to your Atlas cluster is failing with authentication error. This typically happens due to:

1. **IP Whitelist Not Configured** - Your current IP address needs to be whitelisted in Atlas
2. **Incorrect Credentials** - Username or password mismatch
3. **User Not Created** - The database user might not exist

### Steps to Fix MongoDB Atlas Connection:

1. **Log in to MongoDB Atlas Dashboard**
   - Go to: https://cloud.mongodb.com
   - Sign in with your credentials

2. **Add Your IP to Whitelist**
   - Click on "Security" → "Network Access"
   - Click "+ Add IP Address"
   - Option A: Add your current IP
   - Option B: Add "0.0.0.0/0" to allow all IPs (not recommended for production)
   - Click "Confirm"

3. **Verify Database User**
   - Click on "Security" → "Database Access"
   - Look for user "gokilanthangavel"
   - If not found, create a new user:
     - Username: gokilanthangavel
     - Password: Gokilan@005 (or your preferred password)
     - Role: Cluster Manager or Atlas Admin

4. **Test Connection String**
   - Once IP is whitelisted and user is confirmed
   - Connection string: mongodb+srv://gokilanthangavel:Gokilan%40005@cluster0.n1rbw.mongodb.net/smartleave?retryWrites=true&w=majority
   - Replace password special chars: @ = %40

5. **Update .env File**
   - Once verified, update MONGODB_ATLAS_URI with correct credentials

### Current Database Status:

**Local MongoDB Collections:**
- users: 9 documents
  - Roles: student, hod, advisor
  - Departments: CSBS, CSE
  
- leaveRequests: Available for migration

### Migration to Atlas:

Once Atlas setup is complete, run:
```bash
node migrate-to-atlas.js
```

This will:
1. Export all data from local MongoDB
2. Connect to MongoDB Atlas
3. Import all collections to Atlas
4. Verify successful migration

### To Use Atlas Going Forward:

Update your .env:
```
MONGODB_URI=mongodb+srv://gokilanthangavel:Gokilan%40005@cluster0.n1rbw.mongodb.net/smartleave?retryWrites=true&w=majority
```

Then restart the server for changes to take effect.

### Troubleshooting:

- **"bad auth : authentication failed"** → IP not whitelisted or wrong credentials
- **"Server selection timed out"** → IP whitelist issue
- **"ERR_INVALID_ARG_TYPE"** → Connection string malformed

### Support:

For more details, refer to MongoDB Atlas documentation:
https://docs.atlas.mongodb.com/

