import React from "react";
import Modal from "react-modal";

interface PlannerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlanner: () => void;
}

const PlannerPopup: React.FC<PlannerPopupProps> = ({ isOpen, onClose, onAddPlanner }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Planner Feature"
      ariaHideApp={false}
      style={{
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        content: {
          maxWidth: "400px",
          margin: "auto",
          textAlign: "center",
          padding: "20px",
        },
      }}
    >
      <h2>Add Planner Feature</h2>
      <p>Would you like to integrate the planner functionality?</p>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
        <button onClick={onAddPlanner}>Yes</button>
        <button onClick={onClose}>No</button>
      </div>
    </Modal>
  );
};

export default PlannerPopup;