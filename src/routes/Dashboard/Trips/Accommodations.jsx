import { useState } from 'react';
import { Grid, Card, Box, Typography } from '@mui/material';
import { Hotel, Add } from '@mui/icons-material';
import { format } from 'date-fns';
import AccommodationDetails from '../../../shared/components/Modals/AccommodationDetails';

const AccommodationsPanel = ({ accommodations, currency }) => {
  const [open, setOpen] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);

  const handleAccommodationClick = accommodation => {
    setSelectedAccommodation(accommodation);
    setOpen(true);
  };

  return (
    <>
      <Grid container spacing={3}>
        {[...(accommodations || []), 'add_new'].map(accommodation => (
          <Grid
            item
            xs={12}
            md={6}
            key={accommodation === 'add_new' ? 'add_new' : accommodation.id}
          >
            {accommodation === 'add_new' ? (
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
                  Add Accommodation
                </Box>
              </Card>
            ) : (
              <Card
                sx={{ p: 2, cursor: 'pointer' }}
                onClick={() => handleAccommodationClick(accommodation)}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Hotel />
                  <Typography variant="h6">{accommodation.name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {format(new Date(accommodation.checkin_date), 'MMM d, HH:mm')} -{' '}
                  {format(new Date(accommodation.checkout_date), 'MMM d, HH:mm')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cost: {currency} {accommodation.cost}
                </Typography>
              </Card>
            )}
          </Grid>
        ))}
      </Grid>
      <AccommodationDetails
        open={open}
        onClose={() => setOpen(false)}
        accommodation={selectedAccommodation}
      />
    </>
  );
};

export default AccommodationsPanel;
