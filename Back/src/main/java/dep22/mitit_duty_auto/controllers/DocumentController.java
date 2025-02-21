package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.dto.DocumentDto;
import dep22.mitit_duty_auto.entities.enums.TypeOfDocument;
import dep22.mitit_duty_auto.entities.security.Roles;
import dep22.mitit_duty_auto.service.DocumentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.core.io.Resource; // Правильний імпорт!
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import dep22.mitit_duty_auto.entities.Document;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

//    @GetMapping
//    public List<DocumentDto> getAllDocuments(@RequestParam("sendTo") Roles sendTo) {
//        try {
//            Roles sendToRole = Roles.valueOf(String.valueOf(sendTo)); // Вот тут проблема!
//            return documentService.getAllDocuments(sendToRole);
//        } catch (IllegalArgumentException e) {
//            System.out.println("Invalid sendTo value: {"+ sendTo +"}");
//            return Collections.emptyList();
//        }
//    }
@GetMapping
public List<DocumentDto> getAllDocuments(@RequestParam("sendTo") Roles sendTo) {
    return documentService.getAllDocuments(sendTo);
}
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadDocument(@RequestParam("filePath") String filePath) {
        try {
            // Нормалізуємо шлях
            String normalizedFilePath = filePath.replace("\\", "/");
            Path filePathResolved = Paths.get(normalizedFilePath).normalize();

            if (!Files.exists(filePathResolved)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Завантажуємо файл
            Resource resource = (Resource) new UrlResource(filePathResolved.toUri());

            // Визначаємо тип файлу
            String contentType = Files.probeContentType(filePathResolved);
            if (contentType == null) {
                contentType = "application/octet-stream"; // Якщо тип не визначено
            }

            // Відправляємо файл назад з правильним заголовком
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePathResolved.getFileName() + "\"")
                    .body(resource);

        } catch (IOException ex) {
            // Логування помилки
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (Exception e) {
            // Обробка загальних помилок
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }







    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("document") MultipartFile document,
            @RequestParam("typeOfDocument") TypeOfDocument typeOfDocument,
            @RequestParam("createBy") String createBy,
            @RequestParam("sendTo") String sendTo)

    {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && isAuthenticated(authentication)) {
            try {
                if (document.isEmpty()) {
                    return ResponseEntity.badRequest().body("Файл не завантажено.");
                }
                System.out.println("Received file: " + document.getOriginalFilename());

                DocumentDto documentDto = documentService.saveDocument(document, typeOfDocument, createBy, sendTo);
                return ResponseEntity.ok(documentDto);
            } catch (IOException | IllegalArgumentException e) {
                e.printStackTrace(); // Логування помилки
                return ResponseEntity.badRequest().body("Помилка: " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(403).body("Forbidden"); // Or appropriate response
        }
    }




    @PostMapping("/save")
    public ResponseEntity<Document> createDocument(@RequestBody DocumentDto documentDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && isAuthenticated(authentication)) {
            Document savedDocument = documentService.saveDocument(
                    documentDto.getTitle(),
                    documentDto.getTypeOfDocument(),
                    documentDto.getPath(),
                    documentDto.getCreateBy(),
                    documentDto.getSendTo()
            );
            return ResponseEntity.ok(savedDocument);
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }

    @PatchMapping("/{id}/markAsRead")
    public ResponseEntity<?> markAsRead(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && isAuthenticated(authentication)) {
            try {

                documentService.markAsRead(id);
                return ResponseEntity.ok().build();
            } catch (EntityNotFoundException e) {
                return ResponseEntity.notFound().build();
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError().build();
            }
        } else {
            return ResponseEntity.status(403).body("Forbidden");
        }
    }

    private boolean isAuthenticated(Authentication authentication) {
        return authentication != null && authentication.isAuthenticated();
    }
}