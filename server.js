const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const { google } = require('googleapis');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors')

app.use(express.json());
app.use(cors());

// Connect to MongoDB (Make sure MongoDB is running)
mongoose.connect('mongodb+srv://amantech247:kingaman@cluster0.dvkamco.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Define a schema and model for YouTube videos (video model)
const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true },
});

const Video = mongoose.model('Video', videoSchema);

// API endpoint to save a YouTube video ID
app.post('/api/videos', async (req, res) => {
  const { videoId } = req.body;

  try {
    const newVideo = new Video({ videoId });
    await newVideo.save();
    res.json({ success: true, message: 'Video saved successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving video.' });
  }
});

// API endpoint to get all saved YouTube videos
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving videos.' });
  }
});

// API endpoint to get video details by ID
app.get('/api/videos/:videoId', async (req, res) => {
  const { videoId } = req.params;

  try {
    const youtube = google.youtube('v3');
    const response = await youtube.videos.list({
      key: 'AIzaSyB5CJhiRB52KlCxwk9-0SDTFNlpBb_X5jI',
      part: 'snippet',
      id: videoId,
    });

    const videoDetails = response.data.items[0];
    res.json({ success: true, videoDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving video details.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
