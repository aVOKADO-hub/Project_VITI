package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.models.report.ListReport;
import dep22.mitit_duty_auto.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public List<ListReport> getAllReports() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && isAuthenticated(authentication)) {
            String username = authentication.getName();
            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

            System.out.println("User " + username + " is accessing reports.");
            System.out.println("User authorities: " + authorities);

            return reportService.getAllReports();
        } else {
            System.out.println("No authentication found or insufficient rights.");
            return Collections.emptyList();
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