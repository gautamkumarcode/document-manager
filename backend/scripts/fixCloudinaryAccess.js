/**
 * Script to update existing Cloudinary documents from authenticated to public access
 * Run this once to fix all existing documents
 */

require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const Document = require("../models/Document");

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function fixCloudinaryAccess() {
	try {
		// Connect to MongoDB
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Connected to MongoDB");

		// Get all documents
		const documents = await Document.find({});
		console.log(`Found ${documents.length} documents to process`);

		let successCount = 0;
		let errorCount = 0;

		for (const doc of documents) {
			try {
				console.log(`Processing: ${doc.publicId}`);

				// Determine resource type from file URL or type
				let resourceType = "raw";
				if (doc.fileType && doc.fileType.startsWith("image/")) {
					resourceType = "image";
				} else if (doc.fileUrl && doc.fileUrl.includes("/image/")) {
					resourceType = "image";
				}

				// Update the access mode to public by re-uploading with explicit access mode
				const result = await cloudinary.uploader.explicit(doc.publicId, {
					type: "upload",
					resource_type: resourceType,
					access_mode: "public",
				});

				console.log(
					`✓ Updated: ${doc.publicId} - New URL: ${result.secure_url}`
				);

				// Update the document URL in database if it changed
				if (result.secure_url !== doc.fileUrl) {
					doc.fileUrl = result.secure_url;
					await doc.save();
					console.log(`  → Database URL updated`);
				}

				successCount++;
			} catch (error) {
				console.error(`✗ Error processing ${doc.publicId}:`, error.message);
				errorCount++;
			}
		}

		console.log("\n=== Summary ===");
		console.log(`✓ Success: ${successCount}`);
		console.log(`✗ Errors: ${errorCount}`);
		console.log(`Total: ${documents.length}`);

		await mongoose.disconnect();
		console.log("\nDisconnected from MongoDB");
		process.exit(0);
	} catch (error) {
		console.error("Fatal error:", error);
		process.exit(1);
	}
}

// Run the script
fixCloudinaryAccess();
