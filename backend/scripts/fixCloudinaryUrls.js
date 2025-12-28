/**
 * Fix Cloudinary URLs to include proper file extensions
 */

require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const Document = require("../models/Document");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function fixUrls() {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Connected to MongoDB\n");

		const documents = await Document.find({});
		console.log(`Found ${documents.length} documents\n`);

		for (const doc of documents) {
			try {
				// Get resource info from Cloudinary
				let resourceType = "image";
				if (doc.fileUrl && doc.fileUrl.includes("/raw/")) {
					resourceType = "raw";
				}

				const resource = await cloudinary.api.resource(doc.publicId, {
					resource_type: resourceType,
				});

				// Build proper URL with extension
				const properUrl = cloudinary.url(doc.publicId, {
					resource_type: resourceType,
					secure: true,
					type: "upload",
					format: resource.format, // Include the format (pdf, jpg, etc)
				});

				console.log(`${doc.fileName}:`);
				console.log(`  Old: ${doc.fileUrl}`);
				console.log(`  New: ${properUrl}`);

				if (properUrl !== doc.fileUrl) {
					doc.fileUrl = properUrl;
					await doc.save();
					console.log(`  ✓ Updated\n`);
				} else {
					console.log(`  = No change needed\n`);
				}
			} catch (error) {
				console.error(`Error processing ${doc.fileName}:`, error.message, "\n");
			}
		}

		await mongoose.disconnect();
		console.log("Done!");
		process.exit(0);
	} catch (error) {
		console.error("Fatal error:", error);
		process.exit(1);
	}
}

fixUrls();
