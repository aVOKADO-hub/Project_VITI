package dep22.mitit_duty_auto.service;

import dep22.mitit_duty_auto.dto.DocumentDto;
import dep22.mitit_duty_auto.entities.Document;
import dep22.mitit_duty_auto.entities.enums.TypeOfDocument;
import dep22.mitit_duty_auto.repos.DocumentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;

@Slf4j
@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    private static final String UPLOAD_DIR = "C:/uploads/";

    public DocumentDto saveDocument(MultipartFile file,TypeOfDocument typeOfDocument) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Файл пустий. Будь ласка, оберіть документ.");
        }

        // Очистка назви файлу
        String originalFileName = file.getOriginalFilename();
        String cleanFileName = originalFileName.replaceAll("[^a-zA-Zа-яА-ЯёЁїЇіІєЄґҐ0-9\\.\\- ]", "_");


        // Генерація унікального імені
        String uniqueFileName = System.currentTimeMillis() + "_" + cleanFileName;

        // Створення директорії
        File uploadDir = new File(UPLOAD_DIR+"/"+typeOfDocument);
        if (!uploadDir.exists() && !uploadDir.mkdirs()) {
            throw new IOException("Не вдалося створити директорію для завантаження файлів: " + UPLOAD_DIR);
        }
        String documentPath = uploadDir.getAbsolutePath() + "/" + uniqueFileName;

        // Збереження файлу
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, Paths.get(documentPath), StandardCopyOption.REPLACE_EXISTING);
        }

        // Створення сутності документа
        Document documentEntity = new Document(
                cleanFileName,
                getTypeOfDocument(cleanFileName),
                documentPath,
                false,
                new Date(),
                null,
                "currentUser",
                "receiverUser"
        );

        documentEntity = documentRepository.save(documentEntity);

        // Створення DTO
        DocumentDto documentDto = new DocumentDto();
        documentDto.setId(documentEntity.getId());
        documentDto.setTitle(documentEntity.getTitle());
        documentDto.setTypeOfDocument(documentEntity.getTypeOfDocument());
        documentDto.setPath(documentEntity.getPath());
        documentDto.setRead(documentEntity.isRead());
        documentDto.setSendDate(documentEntity.getSendDate());
        documentDto.setReadDate(documentEntity.getReadDate());
        documentDto.setCreateBy(documentEntity.getCreateBy());
        documentDto.setSendTo(documentEntity.getSendTo());

        log.info("Документ успішно завантажено: {}", documentDto);

        return documentDto;
    }

    private TypeOfDocument getTypeOfDocument(String fileName) {
        if (fileName.toLowerCase().endsWith(".docx") || fileName.toLowerCase().endsWith(".doc")) {
            return TypeOfDocument.DAILY_ORDER;
        } else if (fileName.toLowerCase().endsWith(".pdf")) {
            return TypeOfDocument.PERSONNEL_EXPENDITURE;
        }
        throw new IllegalArgumentException("Непідтримуваний формат файлу.");
    }

    public Document saveDocument(String title, TypeOfDocument type, String path, String createBy, String sendTo) {
        Document document = new Document();
        document.setTitle(title);
        document.setTypeOfDocument(type);
        document.setPath(path);
        document.setCreateBy(createBy);
        document.setSendTo(sendTo);
        document.setSendDate(new Date());

        return documentRepository.save(document); // Сохраняем в БД
    }
}
