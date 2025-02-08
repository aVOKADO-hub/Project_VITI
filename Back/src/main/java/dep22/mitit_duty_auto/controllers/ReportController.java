package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.models.report.ListReport;
import dep22.mitit_duty_auto.service.ReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Collection;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public ResponseEntity<List<ListReport>> getAllReports() {
        logger.info("Received request to get all reports");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        logger.info("User: {}, Authorities: {}",
                authentication.getName(),
                authentication.getAuthorities());

        try {
            List<ListReport> reports = reportService.getAllReports();
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            logger.error("Error getting reports", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ListReport getReportById(@PathVariable int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && isAuthenticated(authentication)) {
            return reportService.getReportById(id);
        } else {
            return null; // Or throw exception or return appropriate response
        }
    }

    @PostMapping
    public ListReport addReport(@RequestBody ListReport report) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && isAuthenticated(authentication)) {
            return reportService.saveReport(report);
        } else {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }
    }

    @DeleteMapping("/{id}")
    public void deleteReportById(@PathVariable int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && isAuthenticated(authentication)) {
            reportService.deleteReportById(id);
        } else {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }
    }

    private boolean isAuthenticated(Authentication authentication) {
        return authentication.isAuthenticated() && authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("DUTY_OFFICER_OF_MILITARY_UNIT"));
    }
}