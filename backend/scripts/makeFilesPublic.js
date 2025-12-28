/**
 * Script to properly convert authenticated Cloudinary files to public access
 * This updates both the access control AND regenerates public URLs
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

async function makeFilesPublic() {
	try {
		// Connect to MongoDB
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Connected to MongoDB");

		// Get all documents
		const documents = await Document.find({});
		console.log(`Found ${documents.length} documents to process\n`);

		let successCount = 0;
		let errorCount = 0;

		for (const doc of documents) {
			try {
				console.log(`Processing: ${doc.publicId}`);

				// Determine resource type
				let resourceType = "raw";
				if (doc.fileType && doc.fileType.startsWith("image/")) {
					resourceType = "image";
				} else if (doc.fileUrl && doc.fileUrl.includes("/image/")) {
					resourceType = "image";
				}

				// Method 1: Try to update existing resource
				try {
					await cloudinary.uploader.explicit(doc.publicId, {
						type: "upload",
						resource_type: resourceType,
						access_control: [{ access_type: "anonymous" }],
					});
					console.log(`  ✓ Updated access control`);
				} catch (error) {
					console.log(`  ⚠ Could not update access control: ${error.message}`);
				}

				// Generate a public URL (no signing, type = upload)
				const publicUrl = cloudinary.url(doc.publicId, {
					resource_type: resourceType,
					secure: true,
					type: "upload",
				});

				console.log(`  New URL: ${publicUrl}`);

				// Update document in database if URL changed
				if (publicUrl !== doc.fileUrl) {
					doc.fileUrl = publicUrl;
					await doc.save();
					console.log(`  ✓ Database updated`);
				}

				successCount++;
				console.log(`  ✓ Success!\n`);
			} catch (error) {
				console.error(
					`  ✗ Error processing ${doc.publicId}:`,
					error.message,
					"\n"
				);
				errorCount++;
			}
		}

		console.log("=== Summary ===");
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
makeFilesPublic();
