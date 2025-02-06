package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.dto.DocumentDto;
import dep22.mitit_duty_auto.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import dep22.mitit_duty_auto.entities.Document;

import java.io.IOException;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(@RequestParam("document") MultipartFile document) {
        try {
            DocumentDto documentDto = documentService.saveDocument(document);
            return ResponseEntity.ok(documentDto);
        } catch (IOException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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
