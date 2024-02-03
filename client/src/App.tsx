import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // Fetches the pre-signed URL from the backend
  const fetchPresignedUrl = async () => {
    try {
      const response = await fetch(
        "https://bytcsdy3m8.execute-api.us-east-2.amazonaws.com/prod/uploadURL", {method: 'POST'}
      );
      if (!response.ok) throw new Error("Failed to fetch the pre-signed URL");
      const data = await response.json();
      return data.uploadURL;
    } catch (error) {
      console.error("Error fetching pre-signed URL:", error);
      setMessage("Error fetching upload URL");
      return null;
    }
  };

  // Handles file selection
  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  // Handles the file upload to S3 using the pre-signed URL
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const uploadURL = await fetchPresignedUrl();
    if (!uploadURL) return; // Error message is set within fetchPresignedUrl

    try {
      const response = await fetch(uploadURL, {
        method: "PUT",
        headers: {
          "Content-Type": "video/mp4", // Make sure this matches the ContentType in the pre-signed URL
        },
        body: file,
      });

      if (response.ok) {
        setMessage("Upload successful!");
      } else {
        throw new Error("Upload failed with HTTP status " + response.status);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed.");
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Video</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
