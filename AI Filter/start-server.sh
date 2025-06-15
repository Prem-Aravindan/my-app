#!/bin/bash

echo "🚀 AI Filter - Complete Setup and Start"
echo "======================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed${NC}"
    echo -e "${YELLOW}Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) detected${NC}"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: npm is not available${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm --version) detected${NC}"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installed${NC}"
fi

# Install iOS dependencies if on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    if [ -d "ios" ] && [ ! -d "ios/Pods" ]; then
        echo -e "${BLUE}🍎 Installing iOS dependencies...${NC}"
        cd ios
        pod install
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Failed to install iOS dependencies${NC}"
            cd ..
            exit 1
        fi
        cd ..
        echo -e "${GREEN}✅ iOS dependencies installed${NC}"
    fi
fi

echo ""
echo -e "${BLUE}🌟 Starting AI Filter development server...${NC}"
echo ""
echo -e "${YELLOW}Instructions:${NC}"
echo -e "${YELLOW}1. Keep this terminal open${NC}"
echo -e "${YELLOW}2. Open a new terminal and run:${NC}"
echo -e "${YELLOW}   - npm run android (for Android)${NC}"
echo -e "${YELLOW}   - npm run ios (for iOS, macOS only)${NC}"
echo -e "${YELLOW}3. Test screen recording in the 'Screen' tab${NC}"
echo ""
echo -e "${GREEN}Starting development server...${NC}"
echo ""

# Start the development server
npm start
