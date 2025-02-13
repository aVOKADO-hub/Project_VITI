import React, { useState, useEffect } from 'react';

const DocumentsTable = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('role')

    useEffect(() => {
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
                setDocuments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center p-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Завантаження...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger m-4" role="alert">
                Помилка: {error}
            </div>
        );
    }
    const handleDownload = async (filePath, fileType) => {


        fetch(`http://localhost:8080/api/documents/download?filePath=${encodeURIComponent(filePath)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.blob(); // Отримуємо файл як Blob
                } else {
                    throw new Error('File not found');
                }
            })
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filePath.split('/').pop(); // Ім’я файлу
                link.click();
            })
            .catch(error => {
                console.error('Error:', error);
            });

    };

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Список документів</h3>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Назва</th>
                                <th scope="col">Тип документу</th>
                                <th scope="col">Дата відправлення</th>
                                <th scope="col">Створив</th>
                                <th scope="col">Статус</th>
                                <th scope="col">Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.id}>
                                    <td>{doc.id}</td>
                                    <td>{doc.title}</td>
                                    <td>{doc.typeOfDocument}</td>

                                    <td>{doc.sendDate ? new Date(doc.sendDate).toLocaleString('uk-UA') : '-'}</td>
                                    <td>{doc.createBy}</td>
                                    <td>
                                        <span className={`badge ${doc.isRead ? 'bg-success' : 'bg-warning'}`}>
                                            {doc.isRead ? 'Прочитано' : 'Не прочитано'}
                                        </span>
                                    </td>
                                    <button
                                        className="btn btn-link p-0"
                                        onClick={() => handleDownload(doc.path, doc.typeOfDocument)}
                                        title="Завантажити документ"
                                    >
                                        <img src={require('../../img/docs-downoad.png')} alt="Docs" style={
                                            { width: "30px" }
                                        } />

                                    </button>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DocumentsTable;