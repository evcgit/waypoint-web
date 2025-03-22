import { useEffect, useState } from 'react';
import Modal from '../../../components/Modal';

const AccommodationDetails = ({ open, onClose }) => {
  return (
    <Modal open={open} onModalClose={onClose}>
      Accommodation Details
    </Modal>
  );
};

export default AccommodationDetails;
