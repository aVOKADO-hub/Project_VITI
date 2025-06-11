import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// Переконайтесь, що Bootstrap CSS підключений в public/index.html
// import './AlertsMapPage.css'; // Для додаткових кастомних стилів, якщо потрібно

const AlertsMapPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const alertsMapUrl = "https://alerts.in.ua/";

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleIframeLoad = () => setIsLoading(false);
    const handleBackClick = () => navigate(-1);

    const requestFullscreen = (element) => {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { /* Firefox */
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { /* IE/Edge */
            element.msRequestFullscreen();
        }
    };

    const exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    };

    const toggleFullscreenMode = () => {
        const mapElement = document.getElementById('alerts-map-iframe-container'); // Отримуємо контейнер iframe
        if (!document.fullscreenElement) {
            if (mapElement) requestFullscreen(mapElement); // Робимо повноекранним контейнер iframe
        } else {
            exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

    const formatTime = (date) => date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formatDate = (date) => date.toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' });

    // Стилі для повноекранного режиму iframe (можна винести в CSS)
    const fullscreenStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999, // Дуже високий z-index
        padding: 0,
        margin: 0,
        backgroundColor: 'black' // Фон для повноекранного режиму
    };

    return (
        // Використовуємо клас .wrapper з App.css
        <div className="wrapper .no-sidebar" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
            {/* Анімований фон - це специфічно для Tailwind. Якщо ви відмовляєтеся від Tailwind,
                цю частину потрібно буде реалізувати інакше або прибрати.
                Для Bootstrap немає прямого аналога "animate-float" або "animate-pulse" без JS або кастомного CSS.
            */}
            {/* <div className="absolute inset-0 opacity-20 pointer-events-none"> ... </div> */}


            {/* Основний контент сторінки */}
            <div className={`container-fluid d-flex flex-column ${isFullscreen ? '' : 'p-0'}`}
                style={isFullscreen ? { padding: 0, margin: 0, height: '100vh', width: '100vw' } : { minHeight: 'calc(100vh - 40px - 4.3rem)' /* Висота мінус падінги та відступ сайдбару */ }}>

                {!isFullscreen && (
                    <header className="row mb-4">
                        <div className="col-4">
                            <button onClick={handleBackClick} className="btn btn-outline-light">
                                {/* Можна додати іконку Bootstrap або Lucide, якщо одна з них залишається */}
                                &larr; Назад
                            </button>
                        </div>
                        <div className="col-4 text-center">
                            <div className="bg-dark text-white p-2 rounded shadow-sm border border-secondary">
                                <div className="fs-4 fw-bold">{formatTime(currentTime)}</div>
                                <div className="small">{formatDate(currentTime)}</div>
                            </div>
                        </div>
                        <div className="col-4 text-end">
                            <button onClick={toggleFullscreenMode} className="btn btn-success">
                                {isFullscreen ? 'Вихід з повноекранного' : 'Повний екран'}
                            </button>
                        </div>
                    </header>
                )}

                {!isFullscreen && (
                    <div className="text-center mb-4">
                        <h1 className="display-4" style={{ color: "#e0ebeb" }}>Карта Повітряних Тривог</h1>
                        <p className="lead" style={{ color: "#cdd4d4" }}>Онлайн моніторинг по всій Україні</p>
                    </div>
                )}

                {/* Контейнер для карти */}
                <div
                    id="alerts-map-iframe-container"
                    className={`row flex-grow-1 ${isFullscreen ? 'p-0 m-0' : 'mx-md-3 mb-3'}`}
                    style={isFullscreen ? fullscreenStyles : { /* стилі для неповноекранного режиму, якщо потрібні */ }}
                >
                    <div className={`col-12 ${isFullscreen ? 'p-0' : 'p-0'}`}>
                        <div className={`card h-100 ${isFullscreen ? 'border-0 rounded-0' : 'shadow'}`} style={{ backgroundColor: isFullscreen ? 'black' : '#f8f9fa' }}>
                            {isLoading && !isFullscreen && (
                                <div className="position-absolute top-50 start-50 translate-middle text-center z-2">
                                    <div className="spinner-border text-primary mb-3" role="status">
                                        <span className="visually-hidden">Завантаження...</span>
                                    </div>
                                    <h5>Завантаження карти...</h5>
                                    <p className="text-muted small">Підключення до сервісу alerts.in.ua</p>
                                </div>
                            )}
                            <iframe
                                src={alertsMapUrl}
                                title="Карта повітряних тривог alerts.in.ua"
                                className={`w-100 h-100 ${isFullscreen ? '' : 'rounded'}`} // rounded з Bootstrap
                                style={{ border: isFullscreen ? 'none' : '1px solid #dee2e6' }} // рамка Bootstrap або без неї
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                onLoad={handleIframeLoad}
                            >
                                <div className="d-flex align-items-center justify-content-center h-100">
                                    <div className="text-center">
                                        <p className="lead mb-3">Ваш браузер не підтримує iframe</p>
                                        <a href={alertsMapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                                            Відкрити карту
                                        </a>
                                    </div>
                                </div>
                            </iframe>
                        </div>
                    </div>
                </div>

                {!isFullscreen && (
                    <footer className="row mt-auto pt-3 text-center">
                        <div className="col">
                            <p style={{ color: "#cdd4d4" }}>
                                Карта надана сервісом <a href="https://alerts.in.ua" target="_blank" rel="noopener noreferrer" style={{ color: '#e0ebeb', fontWeight: 'bold' }}>alerts.in.ua</a>
                            </p>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default AlertsMapPage;