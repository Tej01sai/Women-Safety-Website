# MongoDB Atlas Setup Instructions

## Step 1: Get Your Connection String from MongoDB Atlas
1. Log in to MongoDB Atlas (https://cloud.mongodb.com/)
2. Go to your cluster
3. Click "Connect" button
4. Choose "Connect your application"
5. Copy the connection string

## Step 2: Replace in .env file
Your connection string will look like:
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/women-safety?retryWrites=true&w=majority

## Step 3: Replace these placeholders:
- <username>: Your MongoDB Atlas username
- <password>: Your MongoDB Atlas password
- xxxxx: Your cluster identifier (from Atlas)

## Step 4: Network Access
- In Atlas, go to "Network Access"
- Add your current IP address or use 0.0.0.0/0 for development (not recommended for production)

## Example:
MONGO_URI=mongodb+srv://john:mypassword123@cluster0.abc12.mongodb.net/women-safety?retryWrites=true&w=majority

## Security Tips:
- Never commit .env file to version control
- Use strong passwords
- Restrict IP access in production
- Consider using MongoDB Atlas environment variables
