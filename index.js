const express = require('express');
const { resolve } = require('path');
const cors = require('cors');

const app = express();
const port = 3010;
let activities = [
  { activityId: 1, type: 'Running', duration: 30, caloriesBurned: 300 },
  { activityId: 2, type: 'Swimming', duration: 45, caloriesBurned: 400 },
  { activityId: 3, type: 'Cycling', duration: 60, caloriesBurned: 500 },
];

app.use(express.static('static'));
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});
// /activities/add?activityId=4&type=Walking&duration=20&caloriesBurned=150

const sortByduration = () => {
  return activities.sort((a, b) => a.duration - b.duration);
};
const deleteActivity = (activityId) => {
  return activities.filter((res) => res.activityId != activityId);
};

const deleteByType = (type) => {
  return activities.filter((res) => res.type !== type);
};
const updateDuration = (duration, activityId) => {
  return activities.map((res) => {
    if (res.activityId == activityId) {
      console.log(res);
      return { ...res, duration: duration };
    } else {
      return res;
    }
  });
};

const filterByType = (type) => {
  return activities.filter((res) => res.type === type);
};

app.get('/activities/add', (req, res) => {
  try {
    const { activityId, type, duration, caloriesBurned } = req.query;
    let result = [
      ...activities,
      { activityId, type, duration, caloriesBurned },
    ];
    res.status(200).json({ activities: result });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.get('/activities/sort-by-duration', (req, res) => {
  try {
    const result = sortByduration();
    res.status(200).json({ activities: result });
  } catch (e) {
    res.status(500).json(e);
  }
});
// /activities/filter-by-type?type=Running
app.get('/activities/filter-by-type', (req, res) => {
  try {
    const { type } = req.query;
    const result = filterByType(type);
    res.status(200).json({ activities: result });
  } catch (e) {
    res.status(500).json(e);
  }
});

// activities/total-calories

app.get('/activities/total-calories', (req, res) => {
  try {
    let value = 0;
    const result = activities.map((res) => (value += res.caloriesBurned));
    res.status(200).json({ totalCaloriesBurned: value });
  } catch (e) {
    res.status(500).json(e);
  }
});

// /activities/update-duration?activityId=1&duration=35

app.get('/activities/update-duration', (req, res) => {
  try {
    const { duration, activityId } = req.query;

    const result = updateDuration(duration, activityId);
    res.status(200).json({ activities: result });
  } catch (e) {
    res.status(500).json(e);
  }
});

// /activities/delete?activityId=2
app.get('/activities/delete', (req, res) => {
  try {
    const { activityId } = req.query;
    const result = deleteActivity(activityId);
    res.status(200).json({ activities: result });
  } catch (e) {
    res.status(500).json(e);
  }
});

// /activities/delete-by-type?type=Running

app.get('/activities/delete-by-type', (req, res) => {
  try {
    const { type } = req.query;
    const result = deleteByType(type);
    res.status(200).json({ activities: result });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
