const { EC2Client, RunInstancesCommand, CreateTagsCommand } = require("@aws-sdk/client-ec2");
const fs = require("fs");

const createEC2Instance = async () => {
  const client = new EC2Client({ region: "ap-south-1" });

  try {
    // Create EC2 instance
    const runInstancesParams = {
      ImageId: "ami-0dee22c13ea7a9a67", // Amazon Linux AMI
      InstanceType: "t2.micro",
      MinCount: 1,
      MaxCount: 1,
    };

    const runInstancesCommand = new RunInstancesCommand(runInstancesParams);
    const runInstancesResponse = await client.send(runInstancesCommand);

    const instanceId = runInstancesResponse.Instances[0].InstanceId;
    console.log("EC2 Instance Created. Instance ID:", instanceId);
    

    // Add tags to the instance
    const createTagsParams = {
      Resources: [instanceId],
      Tags: [
        {
          Key: "Name",
          Value: "AWS EC2 instance created using JavaScript 1218 1258",
        },
      ],
    };

    const createTagsCommand = new CreateTagsCommand(createTagsParams);
    await client.send(createTagsCommand);

    console.log("Tags added to the instance.");
    // Save the instance ID to data.json
    const data = { instanceId };
    fs.writeFileSync("..//my-cloud/data.json", JSON.stringify(data, null, 2));
    console.log("Instance ID saved to data.json");

  } catch (error) {
    console.error("Error creating EC2 instance:", error);
  }
};

createEC2Instance();