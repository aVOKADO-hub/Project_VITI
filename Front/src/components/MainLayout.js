
import { useState, useEffect } from "react";
import KyivTime from './KyivTime';
import Navbar from "./Navbar";
import Schedule from './Schedule';
import Report from "./Report";
import Instruction from './Instruction';
import DocumentsTable from "./Documents/DocumentsTable";
import Sidebar from "./Sidebar";
import { useEventTimer } from '../hooks/useEventTimer';




function MainLayout({ events }) {
    const { timeLeft, currentEventIndex } = useEventTimer(events); // Використовуємо хук
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [unreadDocumentsCount, setUnreadDocumentsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('role')
    const [documents, setDocuments] = useState([]);
    const [reportNotifications, setReportNotifications] = useState([]);

    const toggleModal = () => setIsModalOpen(prev => !prev);


    const fetchDocuments = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/documents?sendTo=${role}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch documents');
            }

            const data = await response.json();
            const updatedDocuments = data.map(doc => {
                let updatedDoc = { ...doc }; // Копіюємо початковий документ

                // Оновлення поля createBy
                switch (updatedDoc.createBy) {
                    case 'CHIEF_OF_TROOPS_SERVICE':
                        updatedDoc.createBy = 'Начальник служби військ';
                        break;
                    // Додаткові умови для інших значень createBy, якщо потрібно
                    default:
                        break;
                }

                // Оновлення поля typeOfDocument
                switch (updatedDoc.typeOfDocument) {
                    case 'DAILY_ORDER':
                        updatedDoc.typeOfDocument = 'Добовий наказ';
                        break;
                    case 'PERSONNEL_EXPENDITURE':
                        updatedDoc.typeOfDocument = 'Розхід';
                        break;
                    // Додаткові умови для інших значень typeOfDocument, якщо потрібно
                    default:
                        break;
                }

                return updatedDoc;
            });


            setDocuments(updatedDocuments);
            console.log(updatedDocuments)
            setUnreadDocumentsCount(data.filter(doc => !doc.read).length);
            console.log(`DATA ${data}`)

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [role, token]); // Видалили documents зі списку залежностей
    return (
        <div className="main-layout">
            <Sidebar toggleModal={toggleModal} hasUnreadDocuments={unreadDocumentsCount > 0} reportNotifications={reportNotifications} />
            <div className="wrapper">
                <div className="left-section">
                    <KyivTime />
                </div>
                <div className="navbar-section">
                    <Navbar
                        events={events}
                        currentEventIndex={currentEventIndex}
                        timeLeft={timeLeft}
                    />
                </div>
                <div className="schedule-section">
                    <Schedule
                        events={events}
                        currentEventIndex={currentEventIndex}
                    />
                </div>
                <div className="reports-section">
                    <Report />
                </div>
                <div className="instructions-section">
                    <Instruction />
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={toggleModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={toggleModal}>
                            &times;
                        </button>
                        <DocumentsTable
                            setUnreadDocumentsCount={setUnreadDocumentsCount}
                            documents={documents}
                            setDocuments={setDocuments}
                            fetchDocuments={fetchDocuments}
                            loading={loading}
                            error={error}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
export default MainLayout