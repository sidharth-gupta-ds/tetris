#!/bin/bash

echo "🎮 Deploying Tetris Game to Vercel..."

# Activate conda environment
conda activate stable

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🎉 Your Tetris game should be live!"
