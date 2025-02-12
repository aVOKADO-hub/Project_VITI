import React, { useState, useEffect } from 'react';

function DocumentForm() {
    const [file, setFile] = useState(null);
    const [roles, setRoles] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedDocType, setSelectedDocType] = useState('');
    const token = localStorage.getItem("authToken")

    // Завантажуємо ролі та типи документів (можна отримати із бекенду або через константи)
    useEffect(() => {
        setRoles([
            { value: 'dutyOfficer', label: 'Черговий інституту' },
            { value: 'ChiefOfStaff', label: 'Начальник штабу' },
        ]);

        setDocumentTypes([
            { value: 'DAILY_ORDER', label: 'Добовий наказ' },
            { value: 'PERSONNEL_EXPENDITURE', label: 'Розход' },
        ]);
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Зберігаємо файл
    };

    const shareDocument = async () => {
        if (!file || !selectedDocType || !selectedRole) {
            alert('Будь ласка, заповніть всі поля.');
            return;
        }
        try {
            // 1. Відправляємо файл (перший запит)
            if (!file) {
                alert('Будь ласка, завантажте файл');
                return;
            }
            console.log(file); // Додайте це перед формуванням FormData

            const formData = new FormData();
            formData.append('document', file);
            formData.append("typeOfDocument", selectedDocType);

            const fileUploadResponse = await fetch('http://localhost:8080/api/documents/upload', {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData
            });

            if (!fileUploadResponse.ok) {
                throw new Error('Помилка завантаження файлу');
            }

            const fileUploadResult = await fileUploadResponse.json();
            console.log('Файл завантажено:', fileUploadResult);

            // 2. Відправляємо метадані (другий запит)
            const metadata = {
                title: file.name, // Назва документа з назви файлу
                typeOfDocument: selectedDocType,
                path: fileUploadResult.path, // Шлях з першого запиту
                // createBy: localStorage.getItem('role'), // Значення з локального сховища
                createBy: "fooRole",
                sendTo: selectedRole,
            };

            const metadataResponse = await fetch('http://localhost:8080/api/documents/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(metadata),
            });

            if (!metadataResponse.ok) {
                throw new Error('Помилка відправки метаданих');
            }

            const metadataResult = await metadataResponse.json();
            console.log('Метадані збережено:', metadataResult);

            alert('Документ успішно відправлено!');
        } catch (error) {
            console.error('Помилка при відправці документа:', error);
            alert('Не вдалося відправити документ.');
        }
    };

    return (
        <div className="accordion" id="documentAccordion">
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                    <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                    >
                        Відправка документів
                    </button>
                </h2>
                <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#documentAccordion"
                >
                    <div className="accordion-body">
                        <form className="p-4 border rounded shadow-lg">
                            <legend className="mb-4 text-center">Відправити документ</legend>

                            <div className="mb-3">
                                <label htmlFor="docType" className="form-label">
                                    Тип документа
                                </label>
                                <select
                                    id="docType"
                                    className="form-select"
                                    value={selectedDocType}
                                    onChange={(e) => setSelectedDocType(e.target.value)}
                                >
                                    <option value="" disabled>
                                        Оберіть тип документа
                                    </option>
                                    {documentTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="receiverRole" className="form-label">
                                    Отримувач
                                </label>
                                <select
                                    id="receiverRole"
                                    className="form-select"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                >
                                    <option value="" disabled>
                                        Оберіть отримувача
                                    </option>
                                    {roles.map((role) => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="fileUpload" className="form-label">
                                    Завантажити документ
                                </label>
                                <input
                                    type="file"
                                    id="fileUpload"
                                    className="form-control"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary w-100"
                                onClick={shareDocument}
                            >
                                Надіслати документ
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DocumentForm;
