/**
 * Quick script to make a single Cloudinary resource public
 * Usage: node scripts/makePublic.js <publicId>
 * Example: node scripts/makePublic.js tjunksj86rzmg32scrd3
 */

require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const publicId = process.argv[2];

if (!publicId) {
	console.error("Usage: node makePublic.js <publicId>");
	console.error("Example: node makePublic.js tjunksj86rzmg32scrd3");
	process.exit(1);
}

async function makePublic() {
	try {
		// First try as 'image' resource type (common for PDFs)
		console.log(`Attempting to make public: ${publicId}`);

		let result;
		try {
			result = await cloudinary.uploader.explicit(`documents/${publicId}`, {
				type: "upload",
				resource_type: "image",
				access_mode: "public",
			});
			console.log("✓ Success with resource_type: image");
		} catch (error) {
			// If image fails, try raw
			console.log("Trying resource_type: raw");
			result = await cloudinary.uploader.explicit(`documents/${publicId}`, {
				type: "upload",
				resource_type: "raw",
				access_mode: "public",
			});
			console.log("✓ Success with resource_type: raw");
		}

		console.log("\nNew public URL:");
		console.log(result.secure_url);
		console.log("\n✓ Resource is now public!");
	} catch (error) {
		console.error("✗ Error:", error.message);
		process.exit(1);
	}
}

makePublic();
