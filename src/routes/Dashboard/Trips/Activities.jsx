import { useState } from 'react';
import { Grid, Card, Box, Typography } from '@mui/material';
import { Event, Add } from '@mui/icons-material';
import { format } from 'date-fns';
import ActivityDetails from '../../../shared/components/Modals/ActivityDetails';

const ActivitiesPanel = ({ activities, currency }) => {
	const [open, setOpen] = useState(false);
	const [selectedActivity, setSelectedActivity] = useState(null);

	const handleActivityClick = activity => {
		setSelectedActivity(activity);
		setOpen(true);
	};

	return (
		<>
			<Grid container spacing={3}>
				{[...(activities || []), 'add_new'].map(activity => (
					<Grid item xs={12} md={6} key={activity === 'add_new' ? 'add_new' : activity.id}>
        {activity === 'add_new' ? (
          <Card
            sx={{
              p: 2,
              border: '1px dashed #ccc',
              cursor: 'pointer',
              backgroundColor: 'transparent'
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <Add />
              Add Activity
            </Box>
          </Card>
        ) : (
          <Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => handleActivityClick(activity)}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Event />
              <Typography variant="h6">{activity.name}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {format(new Date(activity.start_time), 'MMM d, HH:mm')} -{' '}
              {format(new Date(activity.end_time), 'HH:mm')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cost: {currency} {activity.cost}
            </Typography>
          </Card>
        )}
      </Grid>
    ))}
  </Grid>

			<ActivityDetails open={open} onClose={() => setOpen(false)} activity={selectedActivity} />
		</>
	);
};

export default ActivitiesPanel;
