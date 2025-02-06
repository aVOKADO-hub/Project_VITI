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
import java.util.Date;

@Slf4j
@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    private static final String UPLOAD_DIR = "uploads/";

    public DocumentDto saveDocument(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Файл пуст. Пожалуйста, выберите документ.");
        }

        String documentName = file.getOriginalFilename();
        String documentPath = UPLOAD_DIR + documentName;

        // Создание директории, если её нет
        new File(UPLOAD_DIR).mkdirs();

        // Сохранение файла на сервер
        file.transferTo(new File(documentPath));

        // Создание сущности
        Document documentEntity = new Document(
                documentName,
                getTypeOfDocument(documentName),
                documentPath,
                false,
                new Date(),
                null,
                "currentUser",
                "receiverUser"
        );

        documentEntity = documentRepository.save(documentEntity);

        // Создание DTO
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

        log.info("Документ успешно загружен: {}", documentDto);

        return documentDto;
    }

    private TypeOfDocument getTypeOfDocument(String fileName) {
        if (fileName.toLowerCase().endsWith(".docx") || fileName.toLowerCase().endsWith(".doc")) {
            return TypeOfDocument.DAILY_ORDER;
        } else if (fileName.toLowerCase().endsWith(".pdf")) {
            return TypeOfDocument.PERSONNEL_EXPENDITURE;
        }
        return TypeOfDocument.DAILY_ORDER;
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
