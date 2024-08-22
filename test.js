const response = `Here's a simplified JSON example with three parameters and one object:
{
  "latitude": 22.5726,
  "longitude": 88.3639,
  "zoomLevel": 12,
  "user": {
    "id": "12345",
    "name": "John Doe"
  }
}`;

const jsonString = response.match(/{[\s\S]*}/)[0]; // Extract the JSON part
const parsedJson = JSON.parse(jsonString); // Parse the JSON string

console.log(parsedJson);
