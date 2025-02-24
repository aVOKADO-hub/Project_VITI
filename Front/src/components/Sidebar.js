import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';

const Sidebar = ({ toggleModal, toggleReportsModal, hasUnreadDocuments, reportNotifications }) => {
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
                    {role === 'CHIEF_OF_TROOPS_SERVICE' ? (
                        <div className={`icon documents`} onClick={toggleModal} title="Відправка документів">
                            <img src={require('../img/file-transfer.png')} alt="Docs-menu" style={{ width: "30px" }} />
                        </div>
                    ) : (
                        <div className={`icon documents ${hasUnreadDocuments ? 'notification' : ''}`} onClick={toggleModal} title="Документи">
                            <img src={require('../img/docs.png')} alt="Docs-menu" style={{ width: "30px" }} />
                        </div>
                    )}

                    {/* Додаткові іконки для інших інструментів у майбутньому */}
                    <div className="icon" title="Інший інструмент">
                        <img src={require('../img/tools.png')} alt="Other-tool" style={{ width: "30px" }} />
                    </div>
                    {role === 'CHIEF_OF_TROOPS_SERVICE' ? (
                        <div className="chief-of-troops-container">
                            <div className="icon admin-panel" title="Вхід в адмін панель">
                                <img
                                    src={require('../img/admin.png')}
                                    alt="admin"
                                    style={{
                                        width: "30px", height: "30px"
                                    }}
                                    onClick={handleAdminPanelEnter}
                                />
                            </div>
                            <div className={`icon reports-warn ${reportNotifications.length > 0 ? "warning" : ""}`} title="Невиконані доповіді" onClick={toggleReportsModal}>
                                <img
                                    src={require('../img/warning.png')}
                                    alt="reports"
                                    style={{
                                        width: "30px", height: "30px"
                                    }}
                                />
                            </div>
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