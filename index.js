const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const { JWT } = require('google-auth-library');

const app = express();

// Set up the Google Drive API client
const auth = new JWT({
  email: 'eduio.devops@gmail.com',
  keyFile: 'Important/neweduiotranslationpreyan-731d6315acdc.json',
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});
const drive = google.drive({ version: 'v3', auth });

// Use bodyParser middleware to parse JSON request body
app.use(bodyParser.json());

// Create a POST endpoint for creating a new Google Doc
app.get('/api/create-doc', async (req, res) => {

  // Create a new Google Doc file
  try {
    const fileMetadata = {
      name: 'Named',
      mimeType: 'application/vnd.google-apps.document',
    };
    const file = await drive.files.create({
      resource: fileMetadata,
      fields: 'id',
    });

    // Insert the text content into the new file
    const fileId = file.data.id;
    const request = {
      resource: {
        content: 'This is the text content',
      },
      mimeType: 'text/plain',
    };
    await drive.files.update({
      fileId: fileId,
      media: request,
    });

    // Return the URL of the newly created Google Doc
    const url = `https://drive.google.com/file/d/${fileId}/edit`;
    res.status(200).json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create Google Doc' });
  }
});

// Start the Express server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
