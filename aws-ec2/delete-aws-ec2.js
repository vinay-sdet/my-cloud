const { EC2Client, TerminateInstancesCommand } = require("@aws-sdk/client-ec2");
const fs = require("fs");

const deleteEC2Instance = async (instanceId) => {
  const client = new EC2Client({ region: "ap-south-1" });

  try {
    // Read instance ID from data.json
    const rawData = fs.readFileSync("data.json");
    const { instanceId } = JSON.parse(rawData);
    if (!instanceId) {
      console.error("No instance ID found in data.json");
      return;
    }

    // Terminate EC2 instance
    const terminateParams = {
      InstanceIds: [instanceId],
    };

    const terminateCommand = new TerminateInstancesCommand(terminateParams);
    const terminateResponse = await client.send(terminateCommand);

    console.log("Instance termination initiated:", terminateResponse.TerminatingInstances);

    // Clear the instance ID from data.json
    fs.writeFileSync("data.json", JSON.stringify({}, null, 2));
    console.log("Instance ID removed from data.json");

  } catch (error) {
    console.error("Error terminating EC2 instance:", error);
  }
};

// Replace with your instance ID
const instanceId = "i-005b394f67c35aa8c";
deleteEC2Instance(instanceId);
