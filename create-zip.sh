#!/bin/bash

# Get plugin name from package.json
PLUGIN_NAME=$(node -p "require('./package.json').name")
VERSION=$(node -p "require('./package.json').version")

# Create zip filename
ZIP_NAME="${PLUGIN_NAME}-v${VERSION}.zip"

echo "Creating zip file: $ZIP_NAME"

# Create temporary directory
mkdir -p "$PLUGIN_NAME"

# Copy required files
cp -r dist package.json plugin.json main.py README.md LICENSE "$PLUGIN_NAME/"

# Create zip file
zip -r "$ZIP_NAME" "$PLUGIN_NAME/"

# Clean up
rm -rf "$PLUGIN_NAME/"

echo "✅ Zip file created successfully: $ZIP_NAME"
echo "📁 File size: $(du -h "$ZIP_NAME" | cut -f1)" 