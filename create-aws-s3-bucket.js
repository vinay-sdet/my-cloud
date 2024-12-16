const { S3Client, CreateBucketCommand, DeleteBucketCommand } = require("@aws-sdk/client-s3");
//const s3 = new S3Client({ region: "ap-south-1" }); // Specify your AWS region

const fs = require("fs");
const s3 = new S3Client({
    region: "ap-south-1",
    requestHandler: new (require("@smithy/node-http-handler").NodeHttpHandler)({
        connectionTimeout: 5000, // Connection timeout in milliseconds
        socketTimeout: 30000,    // Socket timeout in milliseconds
    }),
});

// Function to create an S3 bucket
const createBucket = async (bucketName) => {
    try {
        console.log(`Creating bucket: ${bucketName}`);
        const data = await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
        console.log("Bucket created successfully:", data.Location);

         // Save bucket name to a file
         fs.writeFileSync("data.json", JSON.stringify({ bucketName }, null, 2));
         console.log(`Bucket name saved to data.json`);

    } catch (err) {
        console.error("Error creating bucket:", err);
    }
};

// Function to generate a dynamic data source name
const generateDataSourceName = (dataSource) => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedDateTime = `-${month}${day}-${hours}${minutes}`;
    return `${dataSource}${formattedDateTime}`;
};

// Main function to run the script
const run = async () => {
    const datasource = generateDataSourceName("aws-s3-bucket");
    console.log("Generated Bucket Name:", datasource);
    await createBucket(datasource); // Create the bucket
};

run();
