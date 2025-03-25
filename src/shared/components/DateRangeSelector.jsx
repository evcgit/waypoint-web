import { useState, useEffect } from 'react';
import { Button, Popover } from '@mui/material';
import { bindTrigger, bindPopover } from 'material-ui-popup-state/hooks';
import PopupState from 'material-ui-popup-state';
import { DateRangePicker } from '@artemkarimov/mui-date-range-picker';

const DateRangeSelector = ({ startDate, endDate, setStartDate, setEndDate }) => {
  const [dateRange, setDateRange] = useState({
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null
  });

  useEffect(() => {
    setDateRange({
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    });
  }, [startDate, endDate]);

  const handleDateRangeChange = newDateRange => {
    setDateRange(newDateRange);
    if (setStartDate) setStartDate(newDateRange.startDate);
    if (setEndDate) setEndDate(newDateRange.endDate);
  };

  const parseDateRangeText = dateRange => {
    if (dateRange?.startDate && dateRange?.endDate) {
      const startDateString = dateRange.startDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const endDateString = dateRange.endDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      return [[`${startDateString} - ${endDateString}`]];
    }
    return 'Select dates';
  };

  return (
    <PopupState variant="popover" popupId="date-range-popup">
      {popupState => (
        <>
          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            sx={{
              fontSize: '0.825rem',
              py: dateRange.startDate ? 0.5 : 2,
              mx: dateRange.startDate ? 0.5 : 2,
              minWidth: dateRange.startDate ? 250 : 200,
              minHeight: 56,
              alignSelf: 'flex-start'
            }}
            {...bindTrigger(popupState)}
          >
            {parseDateRangeText(dateRange)}
          </Button>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <DateRangePicker
              open={true}
              menuButton={{
                text: 'Cancel',
                onClick: () => {
                  popupState.close();
                }
              }}
              initialDateRange={dateRange}
              onChange={newDateRange => {
                handleDateRangeChange(newDateRange);
                popupState.close();
              }}
              onClose={() => {
                popupState.close();
              }}
            />
          </Popover>
        </>
      )}
    </PopupState>
  );
};

export default DateRangeSelector;
