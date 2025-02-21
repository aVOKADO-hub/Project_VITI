import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';

const Sidebar = ({ toggleModal, hasUnreadDocuments }) => {
    const navigate = useNavigate();
    const [showExitModal, setShowExitModal] = useState(false);

    const role = localStorage.getItem('role')
    const handleClose = () => setShowExitModal(false);
    const handleShow = () => setShowExitModal(true);

    const handleExit = () => {
        navigate('/admin');
        handleClose();
    };

    const handleAdminPanelEnter = () => {
        navigate('/adminPanel');
    }
    return (
        <>
            <aside className="sidebar">
                <div className="tools">
                    {/* Іконка для відкриття модального вікна документів */}
                    <div className={`icon documents ${hasUnreadDocuments ? 'notification' : ''}`} onClick={toggleModal} title="Документи">
                        <img src={require('../img/docs.png')} alt="Docs-menu" style={{ width: "30px" }} />
                    </div>

                    {/* Додаткові іконки для інших інструментів у майбутньому */}
                    <div className="icon" title="Інший інструмент">
                        <img src={require('../img/tools.png')} alt="Other-tool" style={{ width: "30px" }} />
                    </div>
                    {role === 'CHIEF_OF_TROOPS_SERVICE' ? (
                        <div className="icon admin-panel">
                            <img
                                src={require('../img/admin.png')}
                                alt="admin"
                                style={{
                                    width: "30px", height: "30px"
                                }}
                                onClick={handleAdminPanelEnter}
                            />
                        </div>
                    ) : null}
                </div>
                <div className="icon exit">
                    <img
                        src={require('../img/exit.png')}
                        alt="Exit"
                        style={{ width: "30px" }}
                        onClick={handleShow}
                    />
                </div>


            </aside >

            {/* Модальне вікно підтвердження виходу */}
            < Modal show={showExitModal} onHide={handleClose} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Підтвердження виходу</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Ви впевнені що хочете вийти?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Ні
                    </Button>
                    <Button variant="primary" onClick={handleExit}>
                        Так
                    </Button>
                </Modal.Footer>
            </ Modal>
        </>
    );
};

export default Sidebar;