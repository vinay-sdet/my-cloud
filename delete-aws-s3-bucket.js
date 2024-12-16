const { S3Client, ListObjectsV2Command, DeleteObjectsCommand, DeleteBucketCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

// Initialize the S3 Client
const s3 = new S3Client({ region: "ap-south-1" }); // Replace with your region


// Function to empty the bucket
const emptyBucket = async (bucketName) => {
    try {
        // List all objects in the bucket
        const listObjectsResponse = await s3.send(new ListObjectsV2Command({ Bucket: bucketName }));
        
        if (!listObjectsResponse.Contents || listObjectsResponse.Contents.length === 0) {
            console.log(`Bucket ${bucketName} is already empty.`);
            return;
        }

        // Prepare a list of objects to delete
        const deleteParams = {
            Bucket: bucketName,
            Delete: {
                Objects: listObjectsResponse.Contents.map(({ Key }) => ({ Key }))
            }
        };

        // Delete all objects in the bucket
        await s3.send(new DeleteObjectsCommand(deleteParams));
        console.log(`All objects deleted from bucket: ${bucketName}`);
    } catch (err) {
        console.error(`Error emptying bucket: ${err.message}`);
        throw err;
    }
};

// Function to delete the bucket
const deleteBucket = async (bucketName) => {
    try {
        // First empty the bucket
        await emptyBucket(bucketName);

        // Now delete the bucket
        await s3.send(new DeleteBucketCommand({ Bucket: bucketName }));
        console.log(`Bucket "${bucketName}" deleted successfully.`);
    } catch (err) {
        console.error(`Error deleting bucket: ${err.message}`);
    }
};

// Main function to run the script
const run = async () => {
    try {
        // Read bucket name from the file
        const data = fs.readFileSync("data.json", "utf-8");
        const { bucketName } = JSON.parse(data);

        console.log(`Deleting bucket: ${bucketName}`);
        await deleteBucket(bucketName);
    } catch (err) {
        console.error(`Error reading bucket name or deleting bucket: ${err.message}`);
    }
};

run();
