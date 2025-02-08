package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.dto.DocumentDto;
import dep22.mitit_duty_auto.entities.enums.TypeOfDocument;
import dep22.mitit_duty_auto.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import dep22.mitit_duty_auto.entities.Document;

import java.io.IOException;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("document") MultipartFile document,
            @RequestParam("typeOfDocument") TypeOfDocument typeOfDocument) {
        try {
            if (document.isEmpty()) {
                return ResponseEntity.badRequest().body("Файл не завантажено.");
            }
            System.out.println("Received file: " + document.getOriginalFilename());

            DocumentDto documentDto = documentService.saveDocument(document,typeOfDocument);
            return ResponseEntity.ok(documentDto);
        } catch (IOException | IllegalArgumentException e) {
            e.printStackTrace(); // Логування помилки
            return ResponseEntity.badRequest().body("Помилка: " + e.getMessage());
        }
    }


    @PostMapping("/save")
    public ResponseEntity<Document> createDocument(@RequestBody DocumentDto documentDto) {
        Document savedDocument = documentService.saveDocument(
                documentDto.getTitle(),
                documentDto.getTypeOfDocument(),
                documentDto.getPath(),
                documentDto.getCreateBy(),
                documentDto.getSendTo()
        );

        return ResponseEntity.ok(savedDocument);
    }
}
